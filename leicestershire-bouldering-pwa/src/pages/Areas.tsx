// src/pages/Areas.tsx
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import { data } from "../data"; // Adjust path
// Assuming AreaComponent is the renamed SectorListDisplay or similar from previous steps
import AreaComponent from "../components/Area"; // Adjust path if you renamed the component that lists sectors
import { Area as AreaType } from "../types"; // Adjust path
import { countTickedRoutesByArea } from "../db"; // Adjust path

// Helper component to display Area info and fetch its count
const AreaCard: React.FC<{ area: AreaType }> = ({ area }) => {
  const [tickedCount, setTickedCount] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true);

  // Calculate total routes in this area
  const totalRoutesInArea = useMemo(() => {
    if (!area?.sectors) return 0; // Add safety check
    return area.sectors.reduce(
      (sectorSum, sector) =>
        sectorSum +
        (sector.blocks?.reduce(
          (
            blockSum,
            block // Add safety check
          ) =>
            blockSum +
            (block.sections?.reduce(
              (
                sectionSum,
                section // Add safety check
              ) => sectionSum + (section.routes?.length || 0),
              0
            ) || 0),
          0
        ) || 0),
      0
    );
  }, [area]);

  // Fetch ticked count for this area
  useEffect(() => {
    if (area.name) {
      setIsLoadingCount(true);
      countTickedRoutesByArea(area.name)
        .then(setTickedCount)
        .catch((error) => {
          console.error(`Failed to fetch count for area ${area.name}`, error);
          setTickedCount(0);
        })
        .finally(() => setIsLoadingCount(false));
    } else {
      setTickedCount(0);
      setIsLoadingCount(false);
    }
  }, [area.name]);

  return (
    // Remove outer border/padding/shadow/bg - Add mb-4 for spacing between areas
    <div className="mb-4">
      {/* Area Header Bar */}
      <div className="flex justify-between items-center bg-gray-100 p-2 rounded shadow-sm sticky top-0 z-10">
        {" "}
        {/* Bar styling */}
        <Link
          to={`/areas/${area.name}`}
          className="font-bold text-xl hover:underline text-gray-800"
        >
          {area.displayName}
        </Link>
        <p className="text-sm font-semibold text-green-700 whitespace-nowrap ml-4 tabular-nums">
          {isLoadingCount ? "..." : `${tickedCount} / ${totalRoutesInArea}`}
          <span className="font-normal text-gray-500"> Ticked</span>
        </p>
      </div>
      {/* Render the original Area component (or renamed SectorListDisplay) below the bar */}
      {/* Remove padding div */}
      <AreaComponent area={area} />
    </div>
  );
};

// Main Areas Page Component
const Areas: React.FC = () => {
  return (
    // Keep original outer div structure from user's code
    <div className="p-2 flex flex-col gap-y-2">
      {/* Optional: Add a main heading for the page */}
      <h1 className="text-2xl font-bold mb-4 border-b pb-2">Areas</h1>
      {data.map((area) => (
        // Render the AreaCard which now includes the bar header and the sector list
        <AreaCard key={area.name} area={area as AreaType} />
      ))}
      {data.length === 0 && (
        <p className="text-gray-500 italic">No areas found.</p>
      )}
    </div>
  );
};

export default Areas;
