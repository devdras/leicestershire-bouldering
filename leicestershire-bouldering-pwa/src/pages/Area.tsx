// src/pages/Area.tsx (Adjust path as needed)
import React, { useEffect, useState, useMemo } from "react"; // Import React hooks
import { useParams, Link } from "react-router"; // Import Link
import { data } from "../data"; // Adjust path
import type { Area as AreaType } from "../types"; // Adjust path
// *** RENAME this import to match the renamed component file that lists sectors ***
import SectorListDisplay from "../components/Area"; // Was AreaComponent
import { countTickedRoutesByArea } from "../db"; // Adjust path

const Area: React.FC = () => {
  const params = useParams<{ areaName: string }>();
  const { areaName } = params;

  const [thisArea, setThisArea] = useState<AreaType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // State for Area-level tick count
  const [tickedCount, setTickedCount] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true);

  // Effect 1: Find the area data (Safer version)
  useEffect(() => {
    setLoading(true);
    setThisArea(null); // Reset on param change

    if (areaName) {
      // Find area safely, set to null if not found
      const foundArea =
        data.find((filteredArea: AreaType) => filteredArea.name === areaName) ||
        null;
      setThisArea(foundArea);
    }
    // else { setThisArea(null) is already done }

    setLoading(false);
  }, [areaName]); // Re-run effect when `areaName` changes

  // Effect 2: Fetch the ticked routes count for THIS area
  useEffect(() => {
    if (areaName) {
      setIsLoadingCount(true);
      countTickedRoutesByArea(areaName)
        .then(setTickedCount)
        .catch((error) => {
          console.error(
            `Failed to fetch ticked route count for area ${areaName}:`,
            error
          );
          setTickedCount(0);
        })
        .finally(() => {
          setIsLoadingCount(false);
        });
    } else {
      setTickedCount(0);
      setIsLoadingCount(false);
    }
  }, [areaName]); // Depend only on areaName

  // Calculate total routes in this area
  const totalRoutesInArea = useMemo(() => {
    if (!thisArea?.sectors) return 0;
    // Safely calculate total routes
    return thisArea.sectors.reduce(
      (sectorSum, sector) =>
        sectorSum +
        (sector.blocks?.reduce(
          (blockSum, block) =>
            blockSum +
            (block.sections?.reduce(
              (sectionSum, section) =>
                sectionSum + (section.routes?.length || 0),
              0
            ) || 0),
          0
        ) || 0),
      0
    );
  }, [thisArea]); // Recalculate when thisArea data is loaded

  // --- Render Logic ---

  if (loading) {
    // Keep original loading indicator
    return <div className="p-4">Loading...</div>;
  }

  if (!thisArea) {
    // Keep original not found structure, use Link
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Area not found</h2>
        <p>The area "{areaName}" could not be found.</p>
        <Link
          to="/"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          {" "}
          {/* Use Link */}
          Return to all areas
        </Link>
      </div>
    );
  }

  // Keep original main structure
  return (
    <div className="p-2">
      {/* Breadcrumb navigation - Simplified, Use Link */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link to="/" className="hover:underline">
          {" "}
          {/* Link back to Areas list */}
          All Areas
        </Link>
        <span>›</span>
        {/* Current Area Name */}
        <span className="font-medium text-gray-700">
          {thisArea.displayName}
        </span>
      </div>

      {/* Area Title and Tick Count */}
      <div className="flex justify-between items-center border-b pb-1 mb-3">
        {" "}
        {/* Wrap title and count */}
        <p className="font-bold text-xl">{thisArea.displayName}</p>
        {/* Display Area Tick Count */}
        <p className="text-sm font-semibold text-green-700 whitespace-nowrap ml-4 tabular-nums">
          {isLoadingCount ? "..." : `${tickedCount} / ${totalRoutesInArea}`}
          <span className="font-normal text-gray-500"> Ticked</span>
        </p>
      </div>

      {/* Keep original info structure */}
      {thisArea.overview && (
        <div className="mb-2">
          {" "}
          {/* Add margin bottom */}
          <p className="font-bold">Overview</p>
          <p>{thisArea.overview}</p>
        </div>
      )}
      {thisArea.access && (
        <div className="mb-2">
          <p className="font-bold">Access</p>
          <p>{thisArea.access}</p>
        </div>
      )}
      {thisArea.conditions && (
        <div className="mb-2">
          <p className="font-bold">Conditions</p>
          <p>{thisArea.conditions}</p>
        </div>
      )}
      {thisArea.approach && (
        <div className="mb-2">
          <p className="font-bold">Approach</p>
          <p>{thisArea.approach}</p>
        </div>
      )}

      {/* Render Sectors using the renamed component */}
      <div className="mt-4">
        {" "}
        {/* Add margin top */}
        <p className="font-bold text-lg border-b pb-1 mb-2">Sectors</p>{" "}
        {/* Styled title */}
        {/* *** Render the RENAMED component here *** */}
        <SectorListDisplay key={thisArea.name} area={thisArea} />
      </div>
    </div>
  );
};

export default Area;
