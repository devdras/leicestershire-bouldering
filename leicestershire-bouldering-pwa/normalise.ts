// normalize-fixed.ts
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { data } from "./src/data";

// Get the equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeData(data) {
  // Deep clone the data to avoid mutating the original
  const normalizedData = JSON.parse(JSON.stringify(data));

  // // Specific fixes for the known missing grades
  // const hobbitAreaFixes = {
  //   "hobbits-direct": "f5+",
  //   "gimlis-dream": "f4",
  // };

  // console.log(hobbitAreaFixes)

  // Process each area
  normalizedData.forEach((area) => {
    // Ensure all area properties exist
    area.conditions = area.conditions || "";
    area.approach = area.approach || "";
    area.access = area.access || "";
    area.sectors = area.sectors || [];
    area.gpsCoordinates = area.gpsCoordinates || "";

    // Process blocks directly in areas (like in hobs-hole)
    if (area.blocks) {
      normalizeBlocks(area.blocks);
    }

    // Process each sector
    area.sectors.forEach((sector) => {
      // Ensure all sector properties exist
      sector.conditions = sector.conditions || "";
      sector.approach = sector.approach || "";
      sector.access = sector.access || "";
      sector.gpsCoordinates = sector.gpsCoordinates || "";
      sector.blocks = sector.blocks || [];

      // Process each block in the sector
      normalizeBlocks(sector.blocks);
    });
  });

  return normalizedData;
}

// Helper function to normalize blocks and their sections
function normalizeBlocks(blocks) {
  blocks.forEach((block) => {
    // Ensure all block properties exist
    block.conditions = block.conditions || "";
    block.approach = block.approach || "";
    block.access = block.access || "";
    block.gpsCoordinates = block.gpsCoordinates || "";
    block.sections = block.sections || [];

    // Process each section
    block.sections.forEach((section) => {
      // Ensure all section properties exist - THIS IS THE CRITICAL PART
      section.routes = section.routes || [];
      section.gpsCoordinates = section.gpsCoordinates || "";
      section.approach = section.approach || "";
      section.overview = section.overview || "";
      section.conditions = section.conditions || "";
      section.access = section.access || "";
      section.linkUps = section.linkUps || [];

      // Process each route
      section.routes.forEach((route) => {
        // Fix missing grades
        if (route.grade === null) {
          if (route.name === "hobbits-direct") {
            route.grade = "f5+";
          } else if (route.name === "gimlis-dream") {
            route.grade = "f4";
          } else {
            route.grade = "Unknown";
          }
        }

        // Ensure all route properties exist
        route.description = route.description || "";
      });

      // Process linkUps if they exist
      if (section.linkUps) {
        section.linkUps.forEach((linkUp) => {
          linkUp.description = linkUp.description || "";
          linkUp.grade = linkUp.grade || "";
        });
      }
    });
  });
}

// Normalize the data
const normalizedData = normalizeData(data);

// Generate the new data.ts file content
const fileContent = `export const data = ${JSON.stringify(
  normalizedData,
  null,
  2
)};
`;

// Write the normalized data back to data.ts
fs.writeFileSync(path.join(__dirname, "data.ts"), fileContent, "utf8");
// Or use a relative path if __dirname doesn't work
// fs.writeFileSync("./data.ts", fileContent, "utf8");

console.log("✅ Data has been normalized and saved to data.ts");
