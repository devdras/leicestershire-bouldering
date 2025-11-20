// types.ts
/**
 * Types for Leicestershire climbing data
 */

// Route represents an individual climbing route/problem
export interface Route {
  number: number | string;
  name: string;
  displayName: string;
  description: string;
  grade: string; // No longer null after normalization
}

// LinkUp represents a combination of routes
export interface LinkUp {
  name: string;
  displayName: string;
  description: string;
  grade: string;
}

// Section represents a grouping of routes within a block
export interface Section {
  name: string;
  displayName: string;
  routes: Route[];
  // Make these properties optional since they might be missing in some sections
  gpsCoordinates?: string;
  approach?: string;
  overview?: string;
  conditions?: string;
  access?: string;
  linkUps?: LinkUp[];
}

// Block represents a specific climbing boulder or wall
export interface Block {
  name: string;
  displayName: string;
  overview: string;
  conditions: string;
  approach: string;
  access: string;
  gpsCoordinates: string;
  sections: Section[];
}

// Sector represents a collection of blocks in a specific area
export interface Sector {
  name: string;
  displayName: string;
  overview: string;
  conditions: string;
  approach: string;
  access: string;
  gpsCoordinates: string; // Now always present after normalization
  blocks: Block[];
}

// Area represents a broader climbing region
export interface Area {
  name: string;
  displayName: string;
  overview: string;
  conditions?: string;
  approach?: string;
  access?: string;
  sectors: Sector[];
  blocks?: Block[]; // Still optional as not all areas have direct blocks
  gpsCoordinates?: string; // Still optional as not all areas have GPS coordinates
}

// The root data structure
export type ClimbingData = Area[];
