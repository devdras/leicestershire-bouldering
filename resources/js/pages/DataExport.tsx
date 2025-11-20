import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTicks } from '@/hooks/useTicks';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function DataExport() {
    const { ticks } = useTicks();

    const handleExport = () => {
        const dataStr = JSON.stringify(ticks, null, 2);
        const dataUri =
            'data:application/json;charset=utf-8,' +
            encodeURIComponent(dataStr);

        const exportFileDefaultName = `climbing_log_export_${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Data Export', href: '/data-export' }]}>
            <Head title="Data Export" />
            <div className="mx-auto max-w-2xl p-4">
                <h2 className="mb-4 border-b pb-2 text-2xl font-bold text-sidebar-foreground">
                    Data Management
                </h2>

                <div className="mb-6 rounded border border-blue-200 bg-blue-50 p-4 text-blue-900 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-100">
                    <h3 className="mb-2 text-lg font-semibold">Purpose</h3>
                    <p className="text-sm">
                        This page allows you to export your climbing log data.
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                        <li>
                            <strong>Export:</strong> Download a JSON file
                            containing all your ticked routes. This is useful
                            for creating backups.
                        </li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h3 className="mb-2 text-xl font-semibold text-sidebar-foreground">
                        Export Data
                    </h3>
                    <p className="mb-3 text-sm text-sidebar-foreground/70">
                        Download your ticked routes as a JSON backup file.
                    </p>
                    <Button onClick={handleExport} disabled={ticks.length === 0}>
                        <Download className="mr-2 h-4 w-4" />
                        {ticks.length > 0
                            ? `Export ${ticks.length} Ticks`
                            : 'No Ticks to Export'}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
