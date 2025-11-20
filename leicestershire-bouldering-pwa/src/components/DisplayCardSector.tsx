// src/components/DisplayCardSector.tsx
import React, { useEffect, useState, useMemo } from "react"; // Import React hooks
import { Link } from "react-router"; // Import Link
import SimpleBarChart from "./SimpleBarChart";
import { gradeMap } from "../utils/gradeMap";
import { countTickedRoutesBySector } from "../db"; // Import sector count function
import type { Block as BlockType } from "../types"; // Import BlockType

// Update props to include areaName and type data correctly
interface DisplayCardSectorProps {
  displayName: string; // This is the sectorName
  image: string;
  url: string;
  areaName: string; // <-- ADD areaName
  data: BlockType[]; // Type the data prop as an array of Blocks
}

const DisplayCardSector: React.FC<DisplayCardSectorProps> = ({
  displayName, // This acts as sectorName for the count function
  image,
  url,
  areaName, // Use this prop
  data: blocks, // Rename data to blocks for clarity
}) => {
  // State for tick count and loading status for this sector
  const [tickedCount, setTickedCount] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true);

  // Calculate total routes in this sector
  const totalRoutesInSector = useMemo(() => {
    if (!blocks) return 0;
    // Sum routes across all blocks and their sections
    return blocks.reduce(
      (blockSum, block) =>
        blockSum +
        block.sections.reduce(
          (sectionSum, section) => sectionSum + (section.routes?.length || 0),
          0
        ),
      0
    );
  }, [blocks]);

  // Calculate grade distribution (assuming gradeMap works with BlockType[])
  const sortedArray = useMemo(() => {
    if (!blocks) return [];
    // gradeMap might need adjustment if it expects sections directly
    // Assuming gradeMap can handle an array of blocks:
    try {
      // If gradeMap expects sections, flatten them first:
      const allSections = blocks.flatMap((block) => block.sections);
      return gradeMap(allSections);
      // Or if gradeMap expects blocks:
      // return gradeMap(blocks);
    } catch (error) {
      console.error(
        "Error processing gradeMap for sector:",
        displayName,
        error
      );
      return [];
    }
  }, [blocks]);

  // Effect to fetch the ticked routes count for this specific sector
  useEffect(() => {
    if (areaName && displayName) {
      // displayName is the sectorName here
      setIsLoadingCount(true);
      countTickedRoutesBySector(areaName, displayName)
        .then((count) => {
          setTickedCount(count);
        })
        .catch((error) => {
          console.error(
            `Failed to fetch ticked route count for sector ${displayName}:`,
            error
          );
          setTickedCount(0);
        })
        .finally(() => {
          setIsLoadingCount(false);
        });
    } else {
      console.warn("DisplayCardSector missing context to fetch count", {
        areaName,
        sectorName: displayName,
      });
      setTickedCount(0);
      setIsLoadingCount(false);
    }
    // Depend on the context identifiers
  }, [areaName, displayName]);

  return (
    // Use Link instead of <a>
    <Link
      to={url}
      className="flex gap-x-2 border rounded p-3 hover:shadow-md transition-shadow bg-white"
    >
      {" "}
      {/* Added styles */}
      {/* Image */}
      <img
        src={image}
        alt={`Preview for ${displayName} sector`} // Add meaningful alt text
        className="w-32 h-32 md:w-40 md:h-40 rounded flex-shrink-0 object-cover bg-gray-100" // Responsive size
        loading="lazy"
      />
      {/* Content Area */}
      <div className="flex flex-col flex-grow overflow-hidden">
        {" "}
        {/* Ensure content takes remaining space */}
        {/* Header with Name and Tick Count */}
        <div className="flex justify-between items-start mb-1">
          <p className="font-bold text-lg mr-2">{displayName}</p>
          {/* Display Tick Count */}
          <p className="text-xs font-semibold text-green-700 whitespace-nowrap mt-1 tabular-nums">
            {isLoadingCount ? "..." : `${tickedCount} / ${totalRoutesInSector}`}
            <span className="font-normal text-gray-500"> Ticked</span>
          </p>
        </div>
        {/* Bar Chart Container */}
        {/* Make sure SimpleBarChart can handle dynamic height or set fixed height */}
        <div className="flex flex-col items-center flex-grow justify-center min-h-0">
          {" "}
          {/* Allow chart to take space but not overflow */}
          {sortedArray && sortedArray.length > 0 ? (
            <div className="w-full h-24 md:h-28">
              {" "}
              {/* Example fixed height */}
              <SimpleBarChart data={sortedArray} />
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic self-center">
              No grade data
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
export default DisplayCardSector;
