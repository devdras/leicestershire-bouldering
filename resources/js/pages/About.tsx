import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Github } from 'lucide-react';

export default function About() {
    const githubUrl =
        'https://github.com/devdras/leicestershire-bouldering-pwa';

    return (
        <AppLayout breadcrumbs={[{ title: 'About', href: '/about' }]}>
            <Head title="About" />
            <div className="mx-auto max-w-3xl p-4">
                <h2 className="mb-4 border-b pb-2 text-2xl font-bold text-sidebar-foreground">
                    About This App
                </h2>

                <div className="space-y-6 text-sidebar-foreground/80">
                    <p>
                        Welcome! This application serves as an unofficial
                        digital companion and logbook for the fantastic
                        bouldering guides available for Leicestershire.
                    </p>

                    <div className="rounded border border-blue-200 bg-blue-50 p-4 text-blue-900 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-100">
                        <h3 className="mb-2 text-lg font-semibold">
                            Data Source
                        </h3>
                        <p className="text-sm">
                            All the route information, including names, grades,
                            descriptions, and topo images presented in this app,
                            has been transcribed from the excellent and freely
                            available PDF guides published on the{' '}
                            <a
                                href="https://www.leicestershirebouldering.co.uk/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                            >
                                Leicestershire Bouldering website
                            </a>
                            .
                        </p>
                        <p className="mt-2 text-sm">
                            This app is not affiliated with the creators of the
                            original guides. Please visit their website for the
                            official PDFs and support their work!
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-2 text-lg font-semibold">Features</h3>
                        <ul className="list-disc space-y-1 pl-5 text-sm">
                            <li>
                                <strong>Browse Routes:</strong> Navigate through
                                Areas, Sectors, and Crags to find route details.
                            </li>
                            <li>
                                <strong>Tick Routes:</strong> Mark routes you
                                have climbed using the checkmark button.
                            </li>
                            <li>
                                <strong>Track Progress:</strong> Logged-in users
                                have their ticks saved to the database. Guest
                                users have ticks saved to their device.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-2 text-lg font-semibold">
                            Source Code
                        </h3>
                        <p className="text-sm">
                            This project is open source. You can view the code,
                            report issues, or contribute on GitHub:
                        </p>
                        <p className="mt-2">
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                            >
                                <Github size={16} strokeWidth={2} />
                                <span>
                                    devdras/leicestershire-bouldering-pwa
                                </span>
                            </a>
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-2 text-lg font-semibold">
                            Disclaimer
                        </h3>
                        <p className="text-sm">
                            While effort has been made to accurately transcribe
                            the route data, the original PDF guides from
                            Leicestershire Bouldering remain the definitive
                            source. Please refer to them for the most accurate
                            and up-to-date information.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
