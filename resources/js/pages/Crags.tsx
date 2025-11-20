import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Mountain } from 'lucide-react';
import { useTicks } from '@/hooks/useTicks';
import { SimpleBarChart } from '@/components/simple-bar-chart';

interface Crag {
    id: number;
    name: string;
    display_name: string;
    overview: string;
    sector: {
        name: string;
        display_name: string;
        area: {
            name: string;
            display_name: string;
        };
    };
    total_climbs: number;
    climb_ids: number[];
    grades: string[];
    image: string | null;
}

interface Props {
    crags: Crag[];
}

export default function Crags({ crags }: Props) {
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
        <AppLayout breadcrumbs={[{ title: 'Crags', href: '/crags' }]}>
            <Head title="All Crags" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold text-sidebar-foreground mb-4">
                    All Crags
                </h1>
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {crags.map((crag) => {
                        const tickedCount = getTickedCount(crag.climb_ids);
                        const gradeData = getGradeDistribution(crag.grades);

                        return (
                            <Link
                                key={crag.id}
                                href={`/areas/${crag.sector.area.name}/${crag.sector.name}/${crag.name}`}
                                className="group relative flex flex-col overflow-hidden rounded-xl border border-sidebar-border/70 bg-sidebar transition-all hover:border-sidebar-border hover:shadow-md"
                            >
                                {crag.image && (
                                    <div className="relative h-56 w-full overflow-hidden">
                                        <img
                                            src={crag.image}
                                            alt={crag.display_name}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="p-6 flex flex-col h-full">
                                    <div className="mb-3 flex items-center justify-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sidebar-accent/10 text-sidebar-accent transition-colors group-hover:bg-sidebar-accent/20">
                                            <Mountain className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="mb-3 flex items-baseline justify-between gap-2">
                                        <h3 className="text-lg font-semibold text-sidebar-foreground">
                                            {crag.display_name}
                                        </h3>
                                        <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
                                            {tickedCount}/{crag.total_climbs}
                                        </span>
                                    </div>
                                    <p className="text-xs text-sidebar-foreground/50 mb-2">
                                        {crag.sector.area.display_name} / {crag.sector.display_name}
                                    </p>
                                    <p className="line-clamp-2 text-sm text-sidebar-foreground/70 mb-4 flex-grow">
                                        {crag.overview}
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
