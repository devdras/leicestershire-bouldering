import { cademanWoodWestData } from "./sectors/cademan-wood-west";
import { trilobatePlantationData } from "./sectors/trilobate-plantation";
import { hobsHoleData } from "./sectors/hobs-hole";
import { grimleysRockData } from "./sectors/grimleys-rock";
import { theAllotmentsData } from "./sectors/the-allotments";
import { highCademanData } from "./sectors/high-cademan";
import { pinnacleCragData } from "./sectors/pinnacle-crag";
import { graceDieuData } from "./sectors/grace-dieu";
import { poachersRockData } from "./sectors/poachers-rock";
import { swannymoteRockData } from "./sectors/swannymote-rock";

export const cademanWoodAreaData = {
  name: `cademan-wood-area`,
  displayName: `Cademan Wood Area`,
  overview: `The bouldering in Cademan Woods has been extensively climbed
  and developed over the years. A 1993 guide by Geoff Mason and
  Ken Vickers lists a few routes in the woods which are included in
  this guide. More recently, Clint Maskell and Mike Adams have
  transformed the woods into an extensive bouldering venue. The
  problems from their development notes make up the majority of
  the climbs found here. Clint has also been very generous in
  offering advice and information for the guide. `,
  conditions: `The rock is well sheltered in light rain and extremely quick
  drying. With a good wind problems can go from gopping to bone
  dry in a couple of hours. Some of the problems may need a good
  brush and some occasional gardening, a pair of secateurs and a
  stiff brush can often come in handy and keep the problems from
  falling into disuse. `,
  approach: `Finding your way around the woods can be tricky. This guide
  uses a description of the approaches, a map and GPS
  coordinates. The GPS coordinates can be found in the approach
  sections and are formatted so that they can be copied into
  Google to bring up a map. The coordinates for sectors such as
  Cademan West or High Cademan will take you to the main
  parking. The coordinates for individual boulders and areas within
  a sector refer to the areas/boulders themselves.`,
  access: `Cademan Woods has become increasingly popular with climbers,
  however, this increased traffic is presenting a threat to
  continued access. Please keep an eye on the access advice on
  UKC.com which will be more up to date than this guide. Many of
  the issues that come with increased traffic can be addressed if
  we park sensibly and pick up any litter found. Climbers need to
  show that they are having a positive impact on the local
  environment and community.`,
  sectors: [
    cademanWoodWestData,
    trilobatePlantationData,
    hobsHoleData,
    grimleysRockData,
    theAllotmentsData,
    highCademanData,
    pinnacleCragData,
    graceDieuData,
    poachersRockData,
    swannymoteRockData,
  ],
};
