// src/db.ts
import { openDB, DBSchema, IDBPDatabase } from "idb";

// --- Type Definitions ---

export interface RouteTickRecord {
  routeName: string; // Use routeName (displayName) as key
  ticked: boolean; // Always true when record exists
  timestamp: number;
  areaName: string;
  sectorName: string;
  blockName: string;
}

// Define the schema for version 1
interface ClimbingAppDBSchema extends DBSchema {
  routeTicks: {
    key: string; // Type of the key (routeName)
    value: RouteTickRecord; // Type of the stored value
    keyPath: "routeName"; // Set keyPath to routeName
    indexes: {
      byArea: string; // Index on areaName
      bySector: ["areaName", "sectorName"]; // Compound index
      byBlock: ["areaName", "sectorName", "blockName"]; // Compound index
    };
  };
}

// --- Database Setup ---

const DB_NAME = "climbingAppDB";
const DB_VERSION = 1; // Start at version 1 for fresh setup
const STORE_NAME = "routeTicks";

let dbPromise: Promise<IDBPDatabase<ClimbingAppDBSchema>> | null = null;

function initDB(): Promise<IDBPDatabase<ClimbingAppDBSchema>> {
  if (dbPromise) {
    // If promise exists, return it to avoid multiple initializations
    return dbPromise;
  }

  dbPromise = openDB<ClimbingAppDBSchema>(DB_NAME, DB_VERSION, {
    // Upgrade function only needed for the *initial* setup in v1
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log(
        `Initializing DB Schema version ${newVersion}. Old version: ${oldVersion}`
      );

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Create store with routeName as keyPath
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "routeName",
        });
        console.log(`Object store '${STORE_NAME}' created.`);

        // Create indexes directly since it's the initial setup
        store.createIndex("byArea", "areaName");
        console.log("Index 'byArea' created.");
        store.createIndex("bySector", ["areaName", "sectorName"]);
        console.log("Index 'bySector' created.");
        store.createIndex("byBlock", ["areaName", "sectorName", "blockName"]);
        console.log("Index 'byBlock' created.");
      } else {
        console.log(`Object store '${STORE_NAME}' already exists.`);
        // Optional: Check and add indexes if somehow missing but store exists
        const store = transaction.objectStore(STORE_NAME);
        if (!store.indexNames.contains("byArea"))
          store.createIndex("byArea", "areaName");
        if (!store.indexNames.contains("bySector"))
          store.createIndex("bySector", ["areaName", "sectorName"]);
        if (!store.indexNames.contains("byBlock"))
          store.createIndex("byBlock", ["areaName", "sectorName", "blockName"]);
      }
    },
    blocked() {
      console.warn(
        "IndexedDB opening is blocked. Close other tabs using this database."
      );
      dbPromise = null; // Reset promise if blocked
    },
    blocking() {
      console.warn(
        "IndexedDB connection is blocking other instances from opening."
      );
      // Consider closing the connection if needed: db?.close();
      dbPromise = null;
    },
    terminated() {
      console.warn("IndexedDB connection terminated unexpectedly.");
      dbPromise = null; // Reset promise
    },
  });

  // Return the promise for the DB connection
  return dbPromise;
}

/**
 * Gets the initialized IndexedDB database instance.
 * Handles initialization on first call.
 * @returns {Promise<IDBPDatabase<ClimbingAppDBSchema>>} A promise resolving to the DB instance.
 * @throws {Error} If the database cannot be connected.
 */
export async function getDb(): Promise<IDBPDatabase<ClimbingAppDBSchema>> {
  try {
    // Initialize DB if needed, ensures it runs only once.
    return await initDB();
  } catch (error) {
    console.error("Failed to initialize database:", error);
    dbPromise = null; // Allow retry on failure
    throw new Error("Could not connect to the database.");
  }
}

// --- Functions to interact with the store ---

/**
 * Marks a route as ticked in the database, storing its context.
 * Uses routeName as the primary key.
 * @param routeName - The display name of the route (used as key).
 * @param areaName - The name of the area.
 * @param sectorName - The name of the sector.
 * @param blockName - The name of the block.
 * @throws {Error} If required information is missing or DB operation fails.
 */
export async function setRouteTicked(
  routeName: string,
  areaName: string,
  sectorName: string,
  blockName: string
): Promise<void> {
  if (!routeName || !areaName || !sectorName || !blockName) {
    console.error("Attempted to tick route with missing info:", {
      routeName,
      areaName,
      sectorName,
      blockName,
    });
    throw new Error("Missing required information to tick route.");
  }
  try {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const record: RouteTickRecord = {
      routeName: routeName,
      ticked: true,
      timestamp: Date.now(),
      areaName: areaName,
      sectorName: sectorName,
      blockName: blockName,
    };
    // 'put' will insert or update the record based on the key (routeName)
    await store.put(record);
    await tx.done; // Ensure transaction completes
    console.log(`Route '${routeName}' marked as ticked in IDB with context.`);
  } catch (error) {
    console.error(`Failed to set route '${routeName}' as ticked:`, error);
    throw error; // Re-throw to allow calling code to handle
  }
}

/**
 * Removes a route's tick record from the database using its routeName.
 * @param routeName - The display name of the route (used as key).
 */
export async function setRouteUnticked(routeName: string): Promise<void> {
  if (!routeName) {
    console.warn("Attempted to untick route with no routeName.");
    return;
  }
  try {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    await store.delete(routeName); // Delete by routeName key
    await tx.done;
    console.log(
      `Route '${routeName}' unmarked as ticked (record deleted) in IDB.`
    );
  } catch (error) {
    console.error(`Failed to unmark route '${routeName}':`, error);
    throw error;
  }
}

/**
 * Checks if a specific route is marked as ticked in the database.
 * @param routeName - The display name of the route (used as key).
 * @returns {Promise<boolean>} True if the route has a tick record, false otherwise.
 */
export async function getRouteTickStatus(routeName: string): Promise<boolean> {
  if (!routeName) return false;
  try {
    const db = await getDb();
    // Readonly transaction is sufficient and potentially faster for reads
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const record: RouteTickRecord | undefined = await store.get(routeName); // Get by routeName key
    await tx.done;
    // If a record exists (is not undefined), the route is considered ticked
    return record !== undefined;
  } catch (error) {
    console.error(`Failed to get tick status for route '${routeName}':`, error);
    // Decide error handling - returning false might be safest UI-wise
    return false;
  }
}

// --- Query Functions for Counts ---

/**
 * Counts the number of ticked routes within a specific area.
 * @param areaName - The name of the area to query.
 * @returns {Promise<number>} The count of ticked routes in that area.
 */
export async function countTickedRoutesByArea(
  areaName: string
): Promise<number> {
  if (!areaName) return 0;
  try {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, "readonly");
    const index = tx.store.index("byArea");
    // Count entries matching the exact areaName using the index
    const count = await index.count(IDBKeyRange.only(areaName));
    await tx.done;
    return count;
  } catch (error) {
    console.error(`Failed to count ticked routes for area ${areaName}:`, error);
    return 0; // Return 0 on error
  }
}

/**
 * Counts the number of ticked routes within a specific sector of an area.
 * Uses a compound index on [areaName, sectorName].
 * @param areaName - The name of the area.
 * @param sectorName - The name of the sector.
 * @returns {Promise<number>} The count of ticked routes in that sector.
 */
export async function countTickedRoutesBySector(
  areaName: string,
  sectorName: string
): Promise<number> {
  if (!areaName || !sectorName) return 0;
  try {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, "readonly");
    const index = tx.store.index("bySector"); // Use the compound index
    // Query using an array for the compound key
    const count = await index.count(IDBKeyRange.only([areaName, sectorName]));
    await tx.done;
    return count;
  } catch (error) {
    console.error(
      `Failed to count ticked routes for sector ${areaName}/${sectorName}:`,
      error
    );
    return 0; // Return 0 on error
  }
}

/**
 * Counts the number of ticked routes within a specific block of a sector/area.
 * Uses a compound index on [areaName, sectorName, blockName].
 * @param areaName - The name of the area.
 * @param sectorName - The name of the sector.
 * @param blockName - The name of the block.
 * @returns {Promise<number>} The count of ticked routes in that block.
 */
export async function countTickedRoutesByBlock(
  areaName: string,
  sectorName: string,
  blockName: string
): Promise<number> {
  if (!areaName || !sectorName || !blockName) return 0;
  try {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, "readonly");
    const index = tx.store.index("byBlock"); // Use the compound index
    // Query using an array for the compound key
    const count = await index.count(
      IDBKeyRange.only([areaName, sectorName, blockName])
    );
    await tx.done;
    return count;
  } catch (error) {
    console.error(
      `Failed to count ticked routes for block ${areaName}/${sectorName}/${blockName}:`,
      error
    );
    return 0; // Return 0 on error
  }
}

// Function to explicitly close the database connection
export async function closeDb(): Promise<void> {
  if (!dbPromise) {
    console.log("No active DB connection promise to close.");
    return; // No promise means no connection to close
  }
  try {
    // Await the promise to get the actual DB instance
    const db = await dbPromise;
    if (db) {
      db.close(); // Close the connection
      console.log(`Database connection closed for ${DB_NAME}.`);
    }
    // Reset the promise variable so initDB creates a new one next time
    dbPromise = null;
  } catch (error) {
    console.error("Error closing the database connection:", error);
    // Still reset the promise even if closing failed
    dbPromise = null;
  }
}

/**
 * Retrieves all records from the routeTicks object store.
 * @returns {Promise<RouteTickRecord[]>} A promise resolving to an array of all tick records.
 */
export async function getAllRouteTicks(): Promise<RouteTickRecord[]> {
  console.log(`Attempting to get all records from: ${STORE_NAME}`);
  try {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, "readonly"); // Readonly is sufficient
    const store = tx.objectStore(STORE_NAME);
    const allRecords = await store.getAll(); // Efficiently get all records
    await tx.done;
    console.log(`Successfully retrieved ${allRecords.length} records.`);
    return allRecords;
  } catch (error) {
    console.error(`Failed to get all records from '${STORE_NAME}':`, error);
    throw error; // Re-throw
  }
}

/**
 * Imports an array of route tick records into the database.
 * Uses 'put', so it will insert new records or overwrite existing ones based on 'routeName'.
 * Performs the operation in a single transaction for efficiency.
 * @param {RouteTickRecord[]} records - An array of records to import.
 * @throws {Error} If the import fails.
 */
export async function importRouteTicks(
  records: RouteTickRecord[]
): Promise<void> {
  if (!Array.isArray(records)) {
    throw new Error("Import data is not a valid array.");
  }
  const recordCount = records.length;
  console.log(
    `Attempting to import ${recordCount} records into: ${STORE_NAME}`
  );
  if (recordCount === 0) {
    console.log("No records to import.");
    return; // Nothing to do
  }

  try {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, "readwrite"); // Need readwrite to put data
    const store = tx.objectStore(STORE_NAME);

    // Loop through records and add them to the store within the transaction
    for (const record of records) {
      // Basic validation before putting (can be more robust)
      if (
        record &&
        typeof record.routeName === "string" &&
        typeof record.areaName === "string"
      ) {
        await store.put(record); // Use put to insert or update
      } else {
        console.warn("Skipping invalid record during import:", record);
      }
    }

    await tx.done; // Wait for the transaction to complete
    console.log(`Successfully imported/updated ${recordCount} records.`);
  } catch (error) {
    console.error(`Failed to import records into '${STORE_NAME}':`, error);
    throw error; // Re-throw
  }
}
