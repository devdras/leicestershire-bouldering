// src/components/DisplayCardBlock.tsx
import React, { useEffect, useState, useMemo } from "react"; // Import React hooks
import { Link } from "react-router"; // Use Link for navigation
import SimpleBarChart from "./SimpleBarChart"; // Assuming this path is correct
import { gradeMap } from "../utils/gradeMap"; // Assuming this path is correct
import { countTickedRoutesByBlock } from "../db"; // Import count function (adjust path)
import type { Block as BlockType, Section as SectionType } from "../types"; // Import BlockType

// Define Props with correct types
interface DisplayCardBlockProps {
  area: string;
  sector: string;
  block: BlockType; // Use the imported type
}

const DisplayCardBlock: React.FC<DisplayCardBlockProps> = ({
  area,
  sector,
  block,
}) => {
  // State for tick count and loading status, specific to this card
  const [tickedCount, setTickedCount] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true);

  // --- Calculations ---
  // Calculate total routes (using useMemo for optimization)
  const totalRoutesInBlock = useMemo(() => {
    if (!block || !block.sections) return 0;
    return block.sections.reduce(
      (sum, section) => sum + (section.routes?.length || 0), // Handle potentially missing routes array
      0
    );
  }, [block]);

  // Calculate grade distribution data (assuming gradeMap works with block.sections)
  const sortedArray = useMemo(() => {
    if (!block || !block.sections) return [];
    try {
      return gradeMap(block.sections);
    } catch (error) {
      console.error(
        "Error processing gradeMap for block:",
        block.displayName,
        error
      );
      return []; // Return empty array on error
    }
  }, [block]);

  // --- Data Fetching ---
  // Effect to fetch the ticked routes count for this specific block
  useEffect(() => {
    // Ensure we have all necessary identifiers
    if (area && sector && block.name) {
      setIsLoadingCount(true);
      countTickedRoutesByBlock(area, sector, block.name)
        .then((count) => {
          setTickedCount(count);
        })
        .catch((error) => {
          console.error(
            `Failed to fetch ticked route count for block ${block.name}:`,
            error
          );
          setTickedCount(0); // Default to 0 on error
        })
        .finally(() => {
          setIsLoadingCount(false);
        });
    } else {
      // If context is missing, reset count state
      console.warn("DisplayCardBlock missing context to fetch count:", {
        area,
        sector,
        blockName: block.name,
      });
      setTickedCount(0);
      setIsLoadingCount(false);
    }
  }, [area, sector, block.name]); // Dependencies for the effect

  // --- Render Logic ---
  const blockUrl = `/areas/${area}/${sector}/${block.name}`;

  return (
    // Replace <a> with <Link>, keep the layout classes
    <Link
      to={blockUrl}
      className="flex flex-col flex-grow overflow-hidden border rounded p-3 hover:shadow-md transition-shadow bg-white" // Added padding, border, bg, hover effect
    >
      {/* Header with Name and Tick Count */}
      <div className="flex justify-between items-start mb-1">
        <p className="font-bold text-lg text-gray-800">{block.displayName}</p>
        {/* Display Tick Count - Keep styling simple */}
        <p className="text-xs font-semibold text-green-700 whitespace-nowrap ml-2 mt-1 tabular-nums">
          {isLoadingCount ? "..." : `${tickedCount}/${totalRoutesInBlock}`}
          <span className="font-normal text-gray-500"> Ticked</span>
        </p>
      </div>

      {/* Overview and Approach - Conditionally render */}
      {block.overview && (
        <p className="text-sm text-gray-600 mb-1 line-clamp-2">
          {block.overview}
        </p>
      )}
      {block.approach && (
        <p className="text-xs text-gray-500 line-clamp-1">{block.approach}</p>
      )}

      {/* Horizontal scroll container for chart and images */}
      <div className="flex items-center scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-grow gap-x-2 scroll-smooth touch-pan-x overflow-x-auto p-1 h-36 mt-2 border-t pt-2">
        {" "}
        {/* Adjusted height, added top border */}
        {/* Render Bar Chart only if data exists */}
        {sortedArray && sortedArray.length > 0 && (
          <div className="h-32 flex-shrink-0">
            {" "}
            {/* Ensure chart takes space */}
            <SimpleBarChart data={sortedArray} />
          </div>
        )}
        {/* Render Section Topos */}
        {block.sections.map(
          (
            section: SectionType // Add SectionType
          ) => (
            <img
              key={section.name} // Use section name as key
              src={`/${area}/${sector}/${block.name}/${section.name}/topo.webp`}
              alt={`Topo for ${section.displayName}`} // Add meaningful alt text
              className="h-32 object-contain flex-shrink-0 rounded border bg-gray-100" // Added styling for image display
              loading="lazy"
            />
          )
        )}
        {block.sections.length === 0 && !sortedArray?.length && (
          <p className="text-xs text-gray-400 italic self-center">
            No chart data or topos.
          </p>
        )}
      </div>
    </Link>
  );
};
export default DisplayCardBlock;
