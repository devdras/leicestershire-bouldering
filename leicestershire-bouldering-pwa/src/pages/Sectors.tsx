// src/pages/Sectors.tsx

import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router"; // Ensure Link is imported
import { data } from "../data";
import type {
  Sector as SectorType,
  Area as AreaType,
  Block as BlockType,
} from "../types";
import InfoPiece from "../components/InfoPiece";
import DisplayCardBlock from "../components/DisplayCardBlock";
import ConditionalImage from "../components/ConditionalImage";
import { countTickedRoutesBySector } from "../db";

const Sectors: React.FC = () => {
  const params = useParams<{ areaName: string; sectorName: string }>();
  const { areaName, sectorName } = params;

  const [thisArea, setThisArea] = useState<AreaType | null>(null);
  const [thisSector, setThisSector] = useState<SectorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tickedCount, setTickedCount] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true);

  // Effect 1: Find sector data (keep as is)
  useEffect(() => {
    setLoading(true);
    setErrorMsg(null);
    setThisSector(null);
    if (!areaName || !sectorName) {
      setErrorMsg("Required information missing in URL.");
      setLoading(false);
      return;
    }
    const foundArea: AreaType | undefined = data.find(
      (area) => area.name === areaName
    );
    if (!foundArea) {
      setErrorMsg(`Area "${areaName}" not found.`);
      setLoading(false);
      return;
    }
    setThisArea(foundArea);
    const foundSector: SectorType | undefined = foundArea?.sectors.find(
      (sector) => sector.name === sectorName
    );
    if (!foundSector) {
      console.warn(`Sector "${sectorName}" not found in area "${areaName}".`);
    }
    setThisSector(foundSector || null);
    setLoading(false);
  }, [areaName, sectorName]);

  // Effect 2: Fetch the ticked routes count (keep as is)
  useEffect(() => {
    if (areaName && sectorName) {
      setIsLoadingCount(true);
      countTickedRoutesBySector(areaName, sectorName)
        .then(setTickedCount)
        .catch((error) => {
          console.error(`Count fetch error:`, error);
          setTickedCount(0);
        })
        .finally(() => setIsLoadingCount(false));
    } else {
      setTickedCount(0);
      setIsLoadingCount(false);
    }
  }, [areaName, sectorName]);

  // Calculate total routes (keep as is)
  const totalRoutesInSector = useMemo(() => {
    /* ... calculation ... */
    if (!thisSector?.blocks) return 0;
    return thisSector.blocks.reduce(
      (blockSum, block: BlockType) =>
        blockSum +
        (block.sections?.reduce(
          (sectionSum, section) => sectionSum + (section.routes?.length || 0),
          0
        ) || 0),
      0
    );
  }, [thisSector]);

  // --- Render Logic ---

  if (loading) return <div className="p-4">Loading...</div>;
  if (errorMsg) return <div className="p-4 text-red-600">{errorMsg}</div>;
  if (!thisSector) {
    /* ... Not Found JSX ... */
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Sector not found</h2>
        <p>
          The sector '{sectorName}' in area '{areaName}' could not be found.
        </p>
        {areaName && (
          <Link
            to={`/areas/${areaName}`}
            className="text-blue-500 hover:underline mt-4 inline-block"
          >
            Return to area
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="p-2 flex flex-col gap-y-2">
      {/* --- UPDATED Breadcrumb Navigation --- */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm text-gray-500 mb-2"
      >
        {/* Added px-1 */}
        {/* Link to the top-level Areas page */}
        <Link to="/" className="hover:underline hover:text-gray-700">
          All Areas
        </Link>
        <span>›</span>
        {/* Link to the parent Area page */}
        <Link
          to={`/areas/${thisArea?.name}`}
          className="hover:underline hover:text-gray-700"
        >
          {thisArea?.displayName} {/* Displaying the slug/name used in URL */}
        </Link>
        <span>›</span>
        {/* Current Sector Name (not a link) */}
        <span className="font-medium text-gray-700" aria-current="page">
          {thisSector.displayName}
        </span>
      </nav>
      {/* --- END UPDATED Breadcrumb Navigation --- */}

      {/* Header with Sector Name, GPS, and Tick Count */}
      <div className="flex justify-between items-start border-b pb-1 mb-3">
        <div>
          <p className="font-bold text-xl">{thisSector.displayName}</p>
          {thisSector.gpsCoordinates && (
            <p className="text-sm text-gray-500">{thisSector.gpsCoordinates}</p>
          )}
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="text-sm font-semibold text-green-700 whitespace-nowrap tabular-nums">
            {isLoadingCount ? "..." : `${tickedCount} / ${totalRoutesInSector}`}
            <span className="font-normal text-gray-500"> Ticked</span>
          </p>
        </div>
      </div>

      {/* Info Pieces */}
      <div className="px-1">
        {" "}
        {/* Wrap info pieces for consistent padding */}
        {thisSector.overview && (
          <InfoPiece title={"Overview"} info={thisSector.overview} />
        )}
        {thisSector.access && (
          <InfoPiece title={"Access"} info={thisSector.access} />
        )}
        {thisSector.conditions && (
          <InfoPiece title={"Conditions"} info={thisSector.conditions} />
        )}
        {thisSector.approach && (
          <InfoPiece title={"Approach"} info={thisSector.approach} />
        )}
      </div>

      {/* Map Image */}
      <div className="px-1 my-2">
        {" "}
        {/* Wrap image for consistent padding */}
        <ConditionalImage
          src={`/${areaName}/${sectorName}/map.webp`}
          alt={`Map for ${thisSector.displayName}`}
        />
      </div>

      {/* Blocks List */}
      <div className="flex flex-col gap-y-4 mt-4 px-1">
        {" "}
        {/* Added px-1 */}
        <p className="font-bold text-lg border-b pb-1 mb-2">Blocks</p>
        {thisSector.blocks.map((block) => (
          <DisplayCardBlock
            key={block.name}
            area={areaName!}
            sector={sectorName!}
            block={block as BlockType}
          />
        ))}
        {thisSector.blocks.length === 0 && (
          <p className="text-gray-500 italic">
            No blocks found in this sector.
          </p>
        )}
      </div>
    </div>
  );
};

export default Sectors;
