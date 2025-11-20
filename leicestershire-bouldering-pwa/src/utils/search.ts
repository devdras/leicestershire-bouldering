// import { data } from "../data";
// import type { Area, Sector, Block, Route } from "../types";

// interface SearchResults {
//   areas: Array<{ item: Area; matches: string[] }>;
//   sectors: Array<{ item: Sector; areaName: string; matches: string[] }>;
//   blocks: Array<{
//     item: Block;
//     areaName: string;
//     sectorName: string;
//     matches: string[];
//   }>;
//   routes: Array<{
//     item: Route;
//     areaName: string;
//     sectorName: string;
//     blockName: string;
//     sectionName: string;
//     matches: string[];
//   }>;
// }

// export function searchData(query: string): SearchResults {
//   if (!query || query.trim() === "") {
//     return {
//       areas: [],
//       sectors: [],
//       blocks: [],
//       routes: [],
//     };
//   }

//   const searchTerms = query.toLowerCase().trim().split(/\s+/);
//   const results: SearchResults = {
//     areas: [],
//     sectors: [],
//     blocks: [],
//     routes: [],
//   };

//   // Search through all data
//   data.forEach((area) => {
//     // Search in area
//     const areaMatches = searchInObject(area, searchTerms, [
//       "name",
//       "displayName",
//       "overview",
//       "conditions",
//       "approach",
//       "access",
//     ]);
//     if (areaMatches.length > 0) {
//       results.areas.push({ item: area, matches: areaMatches });
//     }

//     // Search in sectors
//     area.sectors.forEach((sector) => {
//       const sectorMatches = searchInObject(sector, searchTerms, [
//         "name",
//         "displayName",
//         "overview",
//         "conditions",
//         "approach",
//         "access",
//       ]);
//       if (sectorMatches.length > 0) {
//         results.sectors.push({
//           item: sector,
//           areaName: area.name,
//           matches: sectorMatches,
//         });
//       }

//       // Search in blocks
//       sector.blocks.forEach((block) => {
//         const blockMatches = searchInObject(block, searchTerms, [
//           "name",
//           "displayName",
//           "overview",
//           "conditions",
//           "approach",
//           "access",
//         ]);
//         if (blockMatches.length > 0) {
//           results.blocks.push({
//             item: block,
//             areaName: area.name,
//             sectorName: sector.name,
//             matches: blockMatches,
//           });
//         }

//         // Search in sections and routes
//         block.sections.forEach((section) => {
//           section.routes.forEach((route) => {
//             const routeMatches = searchInObject(route, searchTerms, [
//               "name",
//               "displayName",
//               "description",
//               "grade",
//             ]);
//             if (routeMatches.length > 0) {
//               results.routes.push({
//                 item: route,
//                 areaName: area.name,
//                 sectorName: sector.name,
//                 blockName: block.name,
//                 sectionName: section.name,
//                 matches: routeMatches,
//               });
//             }
//           });
//         });
//       });
//     });
//   });

//   return results;
// }

// function searchInObject(
//   obj: any,
//   searchTerms: string[],
//   fields: string[]
// ): string[] {
//   const matches: string[] = [];

//   fields.forEach((field) => {
//     if (obj[field] && typeof obj[field] === "string") {
//       const value = obj[field].toLowerCase();

//       searchTerms.forEach((term) => {
//         if (value.includes(term) && !matches.includes(field)) {
//           matches.push(field);
//         }
//       });
//     }
//   });

//   return matches;
// }
