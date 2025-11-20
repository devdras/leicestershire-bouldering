// src/components/Route.tsx
import React from "react";
import TickButton from "./TickButton";
import { useRouteTickStatus } from "../hooks/useRouteTickStatus"; // Adjust path if needed
import type { Route as RouteType } from "../types"; // Adjust path if needed

interface RouteProps {
  route: RouteType;
  areaName: string;
  sectorName: string;
  blockName: string;
  onTickStatusChange?: () => void;
}

const Route: React.FC<RouteProps> = ({
  route,
  areaName,
  sectorName,
  blockName,
  onTickStatusChange,
}) => {
  const { isTicked, isLoading, error, setTickStatus } = useRouteTickStatus({
    routeName: route.displayName,
    areaName: areaName,
    sectorName: sectorName,
    blockName: blockName,
    onTickStatusChange: onTickStatusChange,
  });

  const handleToggleTick = () => {
    setTickStatus(!isTicked);
  };

  // Using a combination that's likely unique for React key prop
  const uniqueReactKey = `${areaName}-${sectorName}-${blockName}-${route.number}-${route.displayName}`;

  return (
    <div
      key={uniqueReactKey}
      className={`mb-3 p-3 border rounded transition-colors duration-150 ${
        error ? "border-red-400 bg-red-50" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center gap-4">
        {/* --- UPDATED Route Info Section --- */}
        {/* Use Flexbox to align circle and text */}
        <div className="flex items-center gap-2 flex-grow min-w-0">
          {" "}
          {/* Add gap-2 */}
          {/* The Number Circle */}
          <div
            className="
                flex items-center justify-center          {/* Center content */}
                w-5 h-5                                 {/* Small size (adjust if needed) */}
                bg-black                                {/* Black background */}
                text-white                              {/* White text */}
                rounded-full                            {/* Make it a circle */}
                text-xs                                 {/* Small text */}
                font-semibold                           {/* Slightly bolder number */}
                flex-shrink-0                           {/* Prevent shrinking */}
              "
            aria-hidden="true" // Hide from screen readers as number is read in text
          >
            {route.number}
          </div>
          {/* Route Name and Grade Text */}
          {/* Apply original text styling here */}
          <p className="font-bold leading-tight text-gray-800 truncate">
            {" "}
            {/* Added truncate */}
            {/* Removed number and dot */}
            {`${route.displayName} (${route.grade})`}
          </p>
        </div>
        {/* --- END UPDATED Route Info Section --- */}

        {/* Tick Button (no change needed) */}
        <div className="flex-shrink-0">
          <TickButton
            isTicked={isTicked}
            toggleTick={handleToggleTick}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Description (no change needed) */}
      {route.description && (
        <p className="mt-1 text-sm text-gray-600">{route.description}</p>
      )}

      {/* Loading/Error indicators (no change needed) */}
      {isLoading && (
        <p className="text-xs text-gray-500 italic mt-1 animate-pulse">
          Loading status...
        </p>
      )}
      {error && (
        <p className="text-xs text-red-600 mt-1 font-medium">Error: {error}</p>
      )}
    </div>
  );
};

export default Route;
