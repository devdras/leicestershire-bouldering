<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Sector;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AreaController extends Controller
{
    public function index()
    {
        $areas = Area::with(['sectors.crags.sections.climbs' => function ($query) {
            $query->select('id', 'section_id', 'grade');
        }])->get();

        $areas = $areas->map(function ($area) {
            // Calculate total climbs and get climb IDs for tick tracking
            $climbs = $area->sectors->flatMap(function ($sector) {
                return $sector->crags->flatMap(function ($crag) {
                    return $crag->sections->flatMap->climbs;
                });
            });

            // Try to find preview image
            $imagePath = null;
            $possiblePaths = [
                "/{$area->name}/preview.webp",
                "/{$area->name}/preview.png",
            ];
            foreach ($possiblePaths as $path) {
                if (file_exists(public_path($path))) {
                    $imagePath = $path;
                    break;
                }
            }

            return [
                'id' => $area->id,
                'name' => $area->name,
                'display_name' => $area->display_name,
                'overview' => $area->overview,
                'slug' => $area->name,
                'total_climbs' => $climbs->count(),
                'climb_ids' => $climbs->pluck('id'),
                'grades' => $climbs->pluck('grade')->toArray(),
                'image' => $imagePath,
            ];
        });

        return Inertia::render('Areas', [
            'areas' => $areas,
        ]);
    }

    public function allSectors()
    {
        $sectors = Sector::with(['area', 'crags.sections.climbs' => function ($query) {
            $query->select('id', 'section_id', 'grade');
        }])->get();

        $sectors = $sectors->map(function ($sector) {
            $climbs = $sector->crags->flatMap(function ($crag) {
                return $crag->sections->flatMap->climbs;
            });

            // Try to find preview image for this sector
            $imagePath = null;
            $possiblePaths = [
                "/{$sector->area->name}/{$sector->name}/preview.webp",
                "/{$sector->area->name}/{$sector->name}/preview.png",
            ];
            foreach ($possiblePaths as $path) {
                if (file_exists(public_path($path))) {
                    $imagePath = $path;
                    break;
                }
            }

            return [
                'id' => $sector->id,
                'name' => $sector->name,
                'display_name' => $sector->display_name,
                'overview' => $sector->overview,
                'area' => [
                    'name' => $sector->area->name,
                    'display_name' => $sector->area->display_name,
                ],
                'total_climbs' => $climbs->count(),
                'climb_ids' => $climbs->pluck('id'),
                'grades' => $climbs->pluck('grade')->toArray(),
                'image' => $imagePath,
            ];
        });

        return Inertia::render('Sectors', [
            'sectors' => $sectors,
        ]);
    }

    public function show(Area $area)
    {
        $area->load(['sectors.crags.sections.climbs' => function ($query) {
            $query->select('id', 'section_id', 'grade');
        }]);

        $sectors = $area->sectors->map(function ($sector) use ($area) {
            $climbs = $sector->crags->flatMap->sections->flatMap->climbs;
            
            // Try to find preview image for this sector
            $imagePath = null;
            $possiblePaths = [
                "/{$area->name}/{$sector->name}/preview.webp",
                "/{$area->name}/{$sector->name}/preview.png",
            ];
            foreach ($possiblePaths as $path) {
                if (file_exists(public_path($path))) {
                    $imagePath = $path;
                    break;
                }
            }
            
            return [
                'id' => $sector->id,
                'name' => $sector->name,
                'display_name' => $sector->display_name,
                'overview' => $sector->overview,
                'total_climbs' => $climbs->count(),
                'climb_ids' => $climbs->pluck('id'),
                'grades' => $climbs->pluck('grade')->toArray(),
                'image' => $imagePath,
            ];
        });

        return Inertia::render('Area', [
            'area' => [
                'id' => $area->id,
                'name' => $area->name,
                'display_name' => $area->display_name,
                'overview' => $area->overview,
                'sectors' => $sectors,
            ],
        ]);
    }
}
