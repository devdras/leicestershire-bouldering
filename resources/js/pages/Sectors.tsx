import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { MapPin } from 'lucide-react';
import { useTicks } from '@/hooks/useTicks';
import { SimpleBarChart } from '@/components/simple-bar-chart';

interface Sector {
    id: number;
    name: string;
    display_name: string;
    overview: string;
    area: {
        name: string;
        display_name: string;
    };
    total_climbs: number;
    climb_ids: number[];
    grades: string[];
    image: string | null;
}

interface Props {
    sectors: Sector[];
}

export default function Sectors({ sectors }: Props) {
    const { getTickedCount } = useTicks();

    const getGradeDistribution = (grades: string[]) => {
        const distribution: Record<string, number> = {};
        grades.forEach((grade) => {
            distribution[grade] = (distribution[grade] || 0) + 1;
        });
        return Object.entries(distribution)
            .map(([grade, count]) => ({ grade, count }))
            .sort((a, b) => a.grade.localeCompare(b.grade, undefined, { numeric: true }));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Sectors', href: '/sectors' }]}>
            <Head title="All Sectors" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold text-sidebar-foreground mb-4">
                    All Sectors
                </h1>
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sectors.map((sector) => {
                        const tickedCount = getTickedCount(sector.climb_ids);
                        const gradeData = getGradeDistribution(sector.grades);

                        return (
                            <Link
                                key={sector.id}
                                href={`/areas/${sector.area.name}/${sector.name}`}
                                className="group relative flex flex-col overflow-hidden rounded-xl border border-sidebar-border/70 bg-sidebar transition-all hover:border-sidebar-border hover:shadow-md"
                            >
                                {sector.image && (
                                    <div className="relative h-56 w-full overflow-hidden">
                                        <img
                                            src={sector.image}
                                            alt={sector.display_name}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="p-6 flex flex-col h-full">
                                    <div className="mb-3 flex items-center justify-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sidebar-accent/10 text-sidebar-accent transition-colors group-hover:bg-sidebar-accent/20">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="mb-3 flex items-baseline justify-between gap-2">
                                        <h3 className="text-lg font-semibold text-sidebar-foreground">
                                            {sector.display_name}
                                        </h3>
                                        <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
                                            {tickedCount}/{sector.total_climbs}
                                        </span>
                                    </div>
                                    <p className="text-xs text-sidebar-foreground/50 mb-2">
                                        {sector.area.display_name}
                                    </p>
                                    <p className="line-clamp-2 text-sm text-sidebar-foreground/70 mb-4 flex-grow">
                                        {sector.overview}
                                    </p>
                                    {gradeData.length > 0 && (
                                        <div className="overflow-x-auto">
                                            <SimpleBarChart data={gradeData} />
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
