// src/pages/Blocks.tsx (Adjust path as needed)
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router"; // Use 'react-router'
import { data } from "../data"; // Adjust path
import type {
  Block as BlockType,
  Sector as SectorType,
  Route as RouteType,
  Area as AreaType, // Import AreaType
} from "../types"; // Adjust path
import InfoPiece from "../components/InfoPiece"; // Adjust path
import Route from "../components/Route"; // Adjust path
import { countTickedRoutesByBlock } from "../db"; // Adjust path

const Blocks: React.FC = () => {
  const params = useParams<{
    areaName: string;
    sectorName: string;
    blockName: string;
  }>();
  const areaName = params.areaName || "";
  const sectorName = params.sectorName || "";
  const blockName = params.blockName || "";

  // Add state for Area and Sector objects to get display names
  const [thisArea, setThisArea] = useState<AreaType | null>(null);
  const [thisSector, setThisSector] = useState<SectorType | null>(null);
  const [thisBlock, setThisBlock] = useState<BlockType | null>(null);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [tickedCount, setTickedCount] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // Optional error state

  // Effect 1: Find Area, Sector, and Block data
  useEffect(() => {
    setIsLoadingData(true);
    setErrorMsg(null);
    setThisArea(null); // Reset state
    setThisSector(null);
    setThisBlock(null);

    if (!areaName || !sectorName || !blockName) {
      setErrorMsg("Required information missing in URL.");
      setIsLoadingData(false);
      return;
    }

    const foundArea = data.find((a) => a.name === areaName);
    if (!foundArea) {
      // setErrorMsg(`Area "${areaName}" not found.`); // Option 1: More specific error
      console.warn(`Area "${areaName}" not found.`);
      setIsLoadingData(false); // Still finish loading even if not found
      return; // Stop if area isn't found
    }
    setThisArea(foundArea); // Store found area

    const foundSector = foundArea.sectors.find((s) => s.name === sectorName);
    if (!foundSector) {
      // setErrorMsg(`Sector "${sectorName}" not found in area "${areaName}".`); // Option 1
      console.warn(`Sector "${sectorName}" not found in area "${areaName}".`);
      setIsLoadingData(false);
      return; // Stop if sector isn't found
    }
    setThisSector(foundSector); // Store found sector

    const foundBlock = foundSector.blocks.find((b) => b.name === blockName);
    if (!foundBlock) {
      // setErrorMsg(`Block "${blockName}" not found in sector "${sectorName}".`); // Option 1
      console.warn(`Block "${blockName}" not found in sector "${sectorName}".`);
      // Keep thisBlock null
    } else {
      setThisBlock(foundBlock); // Store found block
    }

    setIsLoadingData(false); // Finish loading attempt
  }, [areaName, sectorName, blockName]);

  // Define the function to refetch the count (keep as is)
  const refetchTickCount = useCallback(async () => {
    /* ... */
    if (areaName && sectorName && blockName) {
      try {
        const count = await countTickedRoutesByBlock(
          areaName,
          sectorName,
          blockName
        );
        setTickedCount(count);
      } catch (error) {
        console.error("Failed refetch block count:", error);
      }
    }
  }, [areaName, sectorName, blockName]);

  // Effect 2: Fetch the initial ticked routes count (keep as is)
  useEffect(() => {
    setIsLoadingCount(true);
    refetchTickCount().finally(() => setIsLoadingCount(false));
  }, [refetchTickCount]);

  // Calculate total routes using useMemo (keep as is)
  const totalRoutesInBlock = useMemo(() => {
    /* ... */
    if (!thisBlock?.sections) return 0;
    return thisBlock.sections.reduce(
      (sum, section) => sum + (section.routes?.length || 0),
      0
    );
  }, [thisBlock]);

  // --- Render Logic ---

  if (isLoadingData) return <div className="p-4">Loading...</div>;
  if (errorMsg) return <div className="p-4 text-red-600">{errorMsg}</div>; // Handle explicit errors
  if (!thisBlock || !thisSector || !thisArea) {
    // Check all required data is loaded
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Block not found</h2>
        {/* More informative message */}
        <p>
          The block '{blockName}' in sector '{sectorName}' / area '{areaName}'
          could not be found, or its parent area/sector is missing.
        </p>
        {/* Link back to sector (safest bet if block missing) */}
        {areaName && sectorName && (
          <Link
            to={`/areas/${areaName}/${sectorName}`}
            className="text-blue-500 hover:underline mt-4 inline-block"
          >
            Return to sector
          </Link>
        )}
      </div>
    );
  }

  // Render main content
  return (
    // Keep original outer div structure
    <div className="flex flex-col">
      {/* --- UPDATED Breadcrumb Navigation (Matching Sector Style) --- */}
      <nav
        aria-label="Breadcrumb"
        // Use exact classes from the Sectors reference example
        className="flex items-center gap-1.5 text-sm text-gray-500 mb-2 p-2" // Added p-2 back from original Blocks code
      >
        <Link to="/" className="hover:underline hover:text-gray-700">
          All Areas
        </Link>
        <span>›</span>
        <Link
          to={`/areas/${areaName}`} // Link uses slug
          className="hover:underline hover:text-gray-700"
        >
          {thisArea?.displayName || areaName}{" "}
          {/* Text uses display name (fallback to slug) */}
        </Link>
        <span>›</span>
        <Link
          to={`/areas/${areaName}/${sectorName}`} // Link uses slugs
          className="hover:underline hover:text-gray-700"
        >
          {thisSector?.displayName || sectorName}{" "}
          {/* Text uses display name (fallback to slug) */}
        </Link>
        <span>›</span>
        {/* Current Block Name (not a link) */}
        <span className="font-medium text-gray-700" aria-current="page">
          {thisBlock.displayName}
        </span>
      </nav>
      {/* --- END UPDATED Breadcrumb Navigation --- */}

      {/* Header - Keep original structure */}
      <div className="flex justify-between items-center px-2">
        <p className="font-bold text-xl">{thisBlock.displayName}</p>
        <div className="text-right">
          {thisBlock.gpsCoordinates && (
            <p className="text-sm">{thisBlock.gpsCoordinates}</p>
          )}
          {/* Display Tick Count */}
          <p className="text-sm text-green-700 font-medium mt-0.5">
            {isLoadingCount
              ? "..."
              : `${tickedCount} / ${totalRoutesInBlock} Ticked`}
          </p>
        </div>
      </div>

      {/* Info Pieces - Keep original structure */}
      <div className="p-2">
        {thisBlock.overview && (
          <InfoPiece title={"Overview"} info={thisBlock.overview} />
        )}
        {thisBlock.access && (
          <InfoPiece title={"Access"} info={thisBlock.access} />
        )}
        {thisBlock.conditions && (
          <InfoPiece title={"Conditions"} info={thisBlock.conditions} />
        )}
        {thisBlock.approach && (
          <InfoPiece title={"Approach"} info={thisBlock.approach} />
        )}
      </div>

      {/* Sections and Routes - Keep original structure */}
      <div className="flex flex-col gap-y-2">
        {thisBlock.sections.map((section) => (
          <div
            key={`${thisBlock.name}-${section.name}`}
            className="flex flex-col gap-y-2"
          >
            <p className="font-bold bg-gray-200 rounded p-2">
              {section.displayName}
            </p>
            <div className="w-full flex justify-center">
              <img
                src={`/${areaName}/${sectorName}/${thisBlock.name}/${section.name}/topo.webp`}
                alt={`Topo for ${section.displayName}`}
                loading="lazy"
                className="max-w-full h-auto"
              />
            </div>
            <div className="p-2">
              {section.routes.map((route) => (
                <Route
                  key={`${route.number}-${route.displayName}`}
                  route={route as RouteType}
                  areaName={areaName}
                  sectorName={sectorName}
                  blockName={blockName}
                  onTickStatusChange={refetchTickCount}
                />
              ))}
              {section.routes.length === 0 && (
                <p className="text-center text-gray-500 italic py-4">
                  No routes listed in this section.
                </p>
              )}
            </div>
          </div>
        ))}
        {thisBlock.sections.length === 0 && (
          <p className="p-4 text-center text-gray-500 italic">
            No sections found for this block.
          </p>
        )}
      </div>
    </div>
  );
};

export default Blocks;
