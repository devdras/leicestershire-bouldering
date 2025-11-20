<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Sector;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SectorController extends Controller
{
    public function show(Area $area, Sector $sector)
    {
        if ($sector->area_id !== $area->id) {
            abort(404);
        }

        $sector->load(['area', 'crags.sections.climbs' => function ($query) {
            $query->select('id', 'section_id', 'grade');
        }]);

        $crags = $sector->crags->map(function ($crag) use ($sector) {
            $climbs = $crag->sections->flatMap->climbs;
            
            // Try to find topo image from first section
            $imagePath = null;
            if ($crag->sections->isNotEmpty()) {
                $firstSection = $crag->sections->first();
                $possiblePaths = [
                    "/{$sector->area->name}/{$sector->name}/{$crag->name}/{$firstSection->name}/topo.webp",
                    "/{$sector->area->name}/{$sector->name}/{$crag->name}/{$firstSection->name}/topo.png",
                ];
                foreach ($possiblePaths as $path) {
                    if (file_exists(public_path($path))) {
                        $imagePath = $path;
                        break;
                    }
                }
            }
            
            return [
                'id' => $crag->id,
                'name' => $crag->name,
                'display_name' => $crag->display_name,
                'overview' => $crag->overview,
                'total_climbs' => $climbs->count(),
                'climb_ids' => $climbs->pluck('id'),
                'grades' => $climbs->pluck('grade')->toArray(),
                'image' => $imagePath,
            ];
        });

        return Inertia::render('Sector', [
            'area' => $area,
            'sector' => [
                'id' => $sector->id,
                'name' => $sector->name,
                'display_name' => $sector->display_name,
                'overview' => $sector->overview,
                'crags' => $crags,
            ],
        ]);
    }
}
