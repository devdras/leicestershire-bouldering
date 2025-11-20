// src/components/Area.tsx
import React from "react"; // Import React
import { type Area as AreaType } from "../types"; // Keep type import
import DisplayCardSector from "./DisplayCardSector"; // Keep component import

// Keep props definition
const Area: React.FC<{ area: AreaType }> = ({ area }) => {
  return (
    // Keep original outer div structure if desired, or remove if not needed
    <div>
      {/* Keep styling for the list of sectors */}
      <div className="gap-y-2 flex flex-col pb-1 mt-2">
        {area.sectors.map((sector) => (
          <DisplayCardSector
            // Use sector.name as the key for stability
            key={sector.name}
            displayName={sector.displayName}
            image={`/${area.name}/${sector.name}/preview.webp`}
            url={`/areas/${area.name}/${sector.name}`}
            // Pass the blocks data as before
            data={sector.blocks}
            // *** Pass the area.name as the areaName prop ***
            areaName={area.name}
          />
        ))}
        {area.sectors.length === 0 && (
          <p className="text-gray-500 italic px-2">
            No sectors found in this area.
          </p>
        )}
      </div>
    </div>
  );
};

export default Area;
