// src/hooks/useRouteTickStatus.ts
import { useState, useEffect, useCallback } from "react";
import { getRouteTickStatus, setRouteTicked, setRouteUnticked } from "../db"; // Adjust path if needed

// Update params to include the callback
interface UseRouteTickStatusParams {
  routeName: string | null | undefined;
  areaName: string | null | undefined;
  sectorName: string | null | undefined;
  blockName: string | null | undefined;
  /** Optional callback function to execute after a tick status is successfully updated in the DB. */
  onTickStatusChange?: () => void; // <-- ADD THIS CALLBACK PROP
}

interface UseRouteTickStatusReturn {
  isTicked: boolean;
  isLoading: boolean;
  error: string | null;
  setTickStatus: (newStatus: boolean) => Promise<void>;
}

export function useRouteTickStatus({
  routeName,
  areaName,
  sectorName,
  blockName,
  onTickStatusChange, // <-- Destructure the callback
}: UseRouteTickStatusParams): UseRouteTickStatusReturn {
  const [isTicked, setIsTicked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial status (no changes needed here)
  useEffect(() => {
    let isMounted = true;
    // ... (fetch logic remains the same) ...
    const fetchStatus = async () => {
      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }
      if (!routeName) {
        if (isMounted) {
          setIsTicked(false);
          setIsLoading(false);
        }
        return;
      }
      try {
        const status = await getRouteTickStatus(routeName);
        if (isMounted) setIsTicked(status);
      } catch (err) {
        if (isMounted) {
          console.error(`Error fetching status for route '${routeName}':`, err);
          setError("Failed to load route status.");
          setIsTicked(false);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchStatus();
    return () => {
      isMounted = false;
    };
  }, [routeName]);

  // Update setTickStatus function
  const setTickStatus = useCallback(
    async (newStatus: boolean): Promise<void> => {
      if (
        !routeName ||
        typeof routeName !== "string" ||
        !areaName ||
        typeof areaName !== "string" ||
        !sectorName ||
        typeof sectorName !== "string" ||
        !blockName ||
        typeof blockName !== "string"
      ) {
        const missingInfo = { routeName, areaName, sectorName, blockName };
        console.warn(
          "Cannot set tick status: required information is missing or invalid.",
          missingInfo
        );
        setError("Cannot save status: Missing route or context information.");
        return;
      }

      setError(null);
      // Consider adding an isSaving state if needed, independent of initial isLoading
      // setIsLoading(true); // Or use a separate isSaving state

      try {
        if (newStatus) {
          await setRouteTicked(routeName, areaName, sectorName, blockName);
        } else {
          await setRouteUnticked(routeName);
        }
        // Update local state AFTER successful DB operation
        setIsTicked(newStatus);

        // *** CALL THE CALLBACK HERE ***
        if (onTickStatusChange) {
          console.log(
            `Tick status changed for ${routeName}, calling callback.`
          );
          onTickStatusChange(); // Notify the parent component
        }
      } catch (err) {
        console.error(`Error updating status for route '${routeName}':`, err);
        setError("Failed to save status. Please try again.");
      } finally {
        // setIsLoading(false); // Or turn off isSaving state
      }
      // Add the callback to the dependency array
    },
    [routeName, areaName, sectorName, blockName, onTickStatusChange]
  );

  return { isTicked, isLoading, error, setTickStatus };
}
