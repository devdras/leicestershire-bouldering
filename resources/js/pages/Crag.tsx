import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Check, Circle, MapPin } from 'lucide-react';
import { useTicks } from '@/hooks/useTicks';
import { Button } from '@/components/ui/button';

interface Climb {
    id: number;
    name: string;
    display_name: string;
    description: string;
    grade: string;
    number: number;
}

interface Section {
    id: number;
    name: string;
    display_name: string;
    climbs: Climb[];
}

interface Crag {
    id: number;
    name: string;
    display_name: string;
    overview: string;
    gps_coordinates: string | null;
    sections: Section[];
}

interface Area {
    id: number;
    name: string;
    display_name: string;
}

interface Sector {
    id: number;
    name: string;
    display_name: string;
}

interface Props {
    area: Area;
    sector: Sector;
    crag: Crag;
}

export default function Crag({ area, sector, crag }: Props) {
    const { isTicked, addTick, removeTick } = useTicks();

    const handleTick = (climb: Climb) => {
        if (isTicked(climb.id)) {
            removeTick(climb.id);
        } else {
            addTick(
                climb.id,
                new Date().toISOString().split('T')[0],
                'send'
            );
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Areas', href: '/areas' },
                { title: area.display_name, href: `/areas/${area.name}` },
                {
                    title: sector.display_name,
                    href: `/areas/${area.name}/${sector.name}`,
                },
                {
                    title: crag.display_name,
                    href: `/areas/${area.name}/${sector.name}/${crag.name}`,
                },
            ]}
        >
            <Head title={crag.display_name} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4">
                    <div className="flex items-start justify-between">
                        <h1 className="text-2xl font-bold text-sidebar-foreground">
                            {crag.display_name}
                        </h1>
                        {crag.gps_coordinates && (
                            <div className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
                                <MapPin className="h-4 w-4" />
                                <span>{crag.gps_coordinates}</span>
                            </div>
                        )}
                    </div>
                    <p className="mt-2 text-sidebar-foreground/70">
                        {crag.overview}
                    </p>
                </div>

                <div className="space-y-8">
                    {crag.sections.map((section) => (
                        <div key={section.id} className="space-y-4">
                            <h2 className="text-xl font-semibold text-sidebar-foreground bg-sidebar-accent/10 rounded p-2">
                                {section.display_name}
                            </h2>
                            <div className="mb-6">
                                <img
                                    src={`/${area.name}/${sector.name}/${crag.name}/${section.name}/topo.webp`}
                                    alt={`Topo for ${section.display_name}`}
                                    className="w-full max-w-4xl mx-auto object-contain rounded border bg-sidebar"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                            <div className="space-y-3">
                                {section.climbs.map((climb) => {
                                    const ticked = isTicked(climb.id);
                                    return (
                                        <div key={climb.id} className="space-y-2">
                                            <div className="flex items-center gap-4 border border-sidebar-border/70 rounded p-3 bg-sidebar hover:shadow-md transition-shadow">
                                                <div className="flex items-center gap-2 flex-grow min-w-0">
                                                    <div className="flex items-center justify-center w-5 h-5 bg-sidebar-foreground text-sidebar rounded-full text-xs font-semibold flex-shrink-0">
                                                        {climb.number}
                                                    </div>
                                                    <p className="font-bold leading-tight text-sidebar-foreground truncate">
                                                        {climb.display_name} ({climb.grade})
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleTick(climb)}
                                                        className={
                                                            ticked
                                                                ? 'text-green-500 hover:text-green-600 hover:bg-green-50'
                                                                : 'text-sidebar-foreground/50 hover:text-sidebar-foreground'
                                                        }
                                                    >
                                                        {ticked ? (
                                                            <Check className="h-5 w-5" />
                                                        ) : (
                                                            <Circle className="h-5 w-5" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                            {climb.description && (
                                                <p className="text-sm text-sidebar-foreground/70 px-3">
                                                    {climb.description}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
