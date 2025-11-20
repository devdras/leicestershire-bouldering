import { altarStonesData } from "./sectors/altar-stones";
import { markfieldQuarryData } from "./sectors/markfield-quarry";

export const markfieldAreaData = {
  name: `markfield-area`,
  displayName: `Markfield Area`,
  overview: `Area in Leicestershire.`,
  conditions: ``,
  approach: ``,
  access: ``,
  sectors: [altarStonesData, markfieldQuarryData],
};
