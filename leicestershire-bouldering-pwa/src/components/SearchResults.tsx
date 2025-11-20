import type { Area, Sector, Block, Route } from "../types";

interface SearchResultsProps {
  results: {
    areas: Array<{ item: Area; matches: string[] }>;
    sectors: Array<{ item: Sector; areaName: string; matches: string[] }>;
    blocks: Array<{
      item: Block;
      areaName: string;
      sectorName: string;
      matches: string[];
    }>;
    routes: Array<{
      item: Route;
      areaName: string;
      sectorName: string;
      blockName: string;
      sectionName: string;
      matches: string[];
    }>;
  };
  onClose: () => void;
}

const SearchResults = ({ results, onClose }: SearchResultsProps) => {
  const totalResults =
    results.areas.length +
    results.sectors.length +
    results.blocks.length +
    results.routes.length;

  if (totalResults === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Search Results</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
          <div className="p-6 text-center">
            <p>No results found. Try a different search term.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Search Results ({totalResults})</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          {results.areas.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Areas ({results.areas.length})
              </h3>
              <div className="space-y-2">
                {results.areas.map((result, index) => (
                  <a
                    key={index}
                    href={`/areas/${result.item.name}`}
                    className="block p-3 border rounded hover:bg-gray-50"
                    onClick={onClose}
                  >
                    <div className="font-medium">{result.item.displayName}</div>
                    <div className="text-sm text-gray-500">
                      Matched: {result.matches.join(", ")}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {results.sectors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Sectors ({results.sectors.length})
              </h3>
              <div className="space-y-2">
                {results.sectors.map((result, index) => (
                  <a
                    key={index}
                    href={`/areas/${result.areaName}/${result.item.name}`}
                    className="block p-3 border rounded hover:bg-gray-50"
                    onClick={onClose}
                  >
                    <div className="font-medium">{result.item.displayName}</div>
                    <div className="text-sm text-gray-500">
                      Area: {result.areaName.replace(/-/g, " ")}
                    </div>
                    <div className="text-sm text-gray-500">
                      Matched: {result.matches.join(", ")}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {results.blocks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Blocks ({results.blocks.length})
              </h3>
              <div className="space-y-2">
                {results.blocks.map((result, index) => (
                  <a
                    key={index}
                    href={`/areas/${result.areaName}/${result.sectorName}/${result.item.name}`}
                    className="block p-3 border rounded hover:bg-gray-50"
                    onClick={onClose}
                  >
                    <div className="font-medium">{result.item.displayName}</div>
                    <div className="text-sm text-gray-500">
                      Location: {result.areaName.replace(/-/g, " ")} ›{" "}
                      {result.sectorName.replace(/-/g, " ")}
                    </div>
                    <div className="text-sm text-gray-500">
                      Matched: {result.matches.join(", ")}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {results.routes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Routes ({results.routes.length})
              </h3>
              <div className="space-y-2">
                {results.routes.map((result, index) => (
                  <a
                    key={index}
                    href={`/areas/${result.areaName}/${result.sectorName}/${result.blockName}`}
                    className="block p-3 border rounded hover:bg-gray-50"
                    onClick={onClose}
                  >
                    <div className="font-medium">
                      {result.item.number}. {result.item.displayName}{" "}
                      {result.item.grade}
                    </div>
                    <div className="text-sm text-gray-500">
                      Location: {result.areaName.replace(/-/g, " ")} ›{" "}
                      {result.sectorName.replace(/-/g, " ")} ›{" "}
                      {result.blockName.replace(/-/g, " ")}
                    </div>
                    <div className="text-sm text-gray-500">
                      Matched: {result.matches.join(", ")}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
