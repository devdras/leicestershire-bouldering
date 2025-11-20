<?php

namespace App\Http\Controllers;

use App\Models\Crag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CragController extends Controller
{
    public function index()
    {
        $crags = Crag::with(['sector.area', 'sections.climbs' => function ($query) {
            $query->select('id', 'section_id', 'grade');
        }])->get();

        $crags = $crags->map(function ($crag) {
            $climbs = $crag->sections->flatMap->climbs;

            // Try to find preview image for this crag
            $imagePath = null;
            $possiblePaths = [
                "/{$crag->sector->area->name}/{$crag->sector->name}/{$crag->name}/preview.webp",
                "/{$crag->sector->area->name}/{$crag->sector->name}/{$crag->name}/preview.png",
            ];
            foreach ($possiblePaths as $path) {
                if (file_exists(public_path($path))) {
                    $imagePath = $path;
                    break;
                }
            }

            return [
                'id' => $crag->id,
                'name' => $crag->name,
                'display_name' => $crag->display_name,
                'overview' => $crag->overview,
                'sector' => [
                    'name' => $crag->sector->name,
                    'display_name' => $crag->sector->display_name,
                    'area' => [
                        'name' => $crag->sector->area->name,
                        'display_name' => $crag->sector->area->display_name,
                    ],
                ],
                'total_climbs' => $climbs->count(),
                'climb_ids' => $climbs->pluck('id'),
                'grades' => $climbs->pluck('grade')->toArray(),
                'image' => $imagePath,
            ];
        });

        return Inertia::render('Crags', [
            'crags' => $crags,
        ]);
    }

    public function show($areaName, $sectorName, $cragName)
    {
        $crag = Crag::where('name', $cragName)->firstOrFail();
        $crag->load(['sector.area', 'sections.climbs']);

        return Inertia::render('Crag', [
            'area' => $crag->sector->area,
            'sector' => $crag->sector,
            'crag' => $crag,
        ]);
    }
}
