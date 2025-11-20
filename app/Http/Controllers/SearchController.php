<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Climb;
use App\Models\Crag;
use App\Models\Sector;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __invoke(Request $request)
    {
        $query = $request->input('q');

        if (strlen($query) < 2) {
            return response()->json([
                'areas' => [],
                'sectors' => [],
                'crags' => [],
                'climbs' => [],
            ]);
        }

        $areas = Area::where('display_name', 'like', "%{$query}%")
            ->select('id', 'name', 'display_name')
            ->limit(5)
            ->get();

        $sectors = Sector::where('display_name', 'like', "%{$query}%")
            ->with('area:id,name,display_name')
            ->select('id', 'area_id', 'name', 'display_name')
            ->limit(5)
            ->get();

        $crags = Crag::where('display_name', 'like', "%{$query}%")
            ->with(['sector.area:id,name,display_name', 'sector:id,area_id,name,display_name'])
            ->select('id', 'sector_id', 'name', 'display_name')
            ->limit(5)
            ->get();

        $climbs = Climb::where('display_name', 'like', "%{$query}%")
            ->with(['section.crag.sector.area:id,name,display_name', 'section.crag.sector:id,area_id,name,display_name', 'section.crag:id,sector_id,name,display_name'])
            ->select('id', 'section_id', 'name', 'display_name', 'grade')
            ->limit(10)
            ->get();

        return response()->json([
            'areas' => $areas,
            'sectors' => $sectors,
            'crags' => $crags,
            'climbs' => $climbs,
        ]);
    }
}
