<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\Climb;
use App\Models\Crag;
use App\Models\Section;
use App\Models\Sector;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;

class LegacyDataSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = storage_path('app/legacy_data.json');

        if (!File::exists($jsonPath)) {
            $this->command->error("File not found: $jsonPath");
            return;
        }

        $data = json_decode(File::get($jsonPath), true);

        DB::transaction(function () use ($data) {
            foreach ($data as $areaData) {
                $area = Area::create([
                    'name' => $areaData['name'],
                    'display_name' => $areaData['displayName'],
                    'overview' => $areaData['overview'] ?? null,
                    'conditions' => $areaData['conditions'] ?? null,
                    'approach' => $areaData['approach'] ?? null,
                    'access' => $areaData['access'] ?? null,
                ]);

                foreach ($areaData['sectors'] as $sectorData) {
                    $sector = Sector::create([
                        'area_id' => $area->id,
                        'name' => $sectorData['name'],
                        'display_name' => $sectorData['displayName'],
                        'overview' => $sectorData['overview'] ?? null,
                        'conditions' => $sectorData['conditions'] ?? null,
                        'approach' => $sectorData['approach'] ?? null,
                        'access' => $sectorData['access'] ?? null,
                        'gps_coordinates' => $sectorData['gpsCoordinates'] ?? null,
                    ]);

                    foreach ($sectorData['blocks'] as $cragData) {
                        $crag = Crag::create([
                            'sector_id' => $sector->id,
                            'name' => $cragData['name'],
                            'display_name' => $cragData['displayName'],
                            'overview' => $cragData['overview'] ?? null,
                            'conditions' => $cragData['conditions'] ?? null,
                            'approach' => $cragData['approach'] ?? null,
                            'access' => $cragData['access'] ?? null,
                            'gps_coordinates' => $cragData['gpsCoordinates'] ?? null,
                        ]);

                        foreach ($cragData['sections'] as $sectionData) {
                            $section = Section::create([
                                'crag_id' => $crag->id,
                                'name' => $sectionData['name'],
                                'display_name' => $sectionData['displayName'],
                            ]);

                            foreach ($sectionData['routes'] as $climbData) {
                                Climb::create([
                                    'section_id' => $section->id,
                                    'number' => (string)$climbData['number'],
                                    'name' => $climbData['name'],
                                    'display_name' => $climbData['displayName'],
                                    'description' => $climbData['description'] ?? null,
                                    'grade' => $climbData['grade'] ?? null,
                                ]);
                            }
                        }
                    }
                }
            }
        });

        $this->command->info('Legacy data imported successfully.');
    }
}
