import { useState, useEffect } from 'react';
import { Search as SearchIcon, Loader2, MapPin, Mountain, Map } from 'lucide-react';
import { Link } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchResults {
    areas: any[];
    sectors: any[];
    crags: any[];
    climbs: any[];
}

export function SearchDialog() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResults>({
        areas: [],
        sectors: [],
        crags: [],
        climbs: [],
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 2) {
                setLoading(true);
                fetch(`/search?q=${encodeURIComponent(query)}`)
                    .then((res) => res.json())
                    .then((data) => {
                        setResults(data);
                        setLoading(false);
                    });
            } else {
                setResults({ areas: [], sectors: [], crags: [], climbs: [] });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
                >
                    <SearchIcon className="h-4 w-4 xl:mr-2" />
                    <span className="hidden xl:inline-flex">Search...</span>
                    <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Search</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-2">
                        <SearchIcon className="h-4 w-4 opacity-50" />
                        <Input
                            placeholder="Type to search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="col-span-3"
                        />
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto space-y-4">
                        {results.areas.length > 0 && (
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-muted-foreground">Areas</h4>
                                <div className="grid gap-2">
                                    {results.areas.map((area) => (
                                        <Link
                                            key={area.id}
                                            href={`/areas/${area.name}`}
                                            onClick={handleSelect}
                                            className="flex items-center gap-2 rounded-md p-2 hover:bg-accent"
                                        >
                                            <Map className="h-4 w-4" />
                                            <span>{area.display_name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                        {results.sectors.length > 0 && (
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-muted-foreground">Sectors</h4>
                                <div className="grid gap-2">
                                    {results.sectors.map((sector) => (
                                        <Link
                                            key={sector.id}
                                            href={`/areas/${sector.area.name}/${sector.name}`}
                                            onClick={handleSelect}
                                            className="flex items-center gap-2 rounded-md p-2 hover:bg-accent"
                                        >
                                            <MapPin className="h-4 w-4" />
                                            <div className="flex flex-col">
                                                <span>{sector.display_name}</span>
                                                <span className="text-xs text-muted-foreground">{sector.area.display_name}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                        {results.crags.length > 0 && (
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-muted-foreground">Crags</h4>
                                <div className="grid gap-2">
                                    {results.crags.map((crag) => (
                                        <Link
                                            key={crag.id}
                                            href={`/areas/${crag.sector.area.name}/${crag.sector.name}/${crag.name}`}
                                            onClick={handleSelect}
                                            className="flex items-center gap-2 rounded-md p-2 hover:bg-accent"
                                        >
                                            <Mountain className="h-4 w-4" />
                                            <div className="flex flex-col">
                                                <span>{crag.display_name}</span>
                                                <span className="text-xs text-muted-foreground">{crag.sector.area.display_name} / {crag.sector.display_name}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                        {results.climbs.length > 0 && (
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-muted-foreground">Climbs</h4>
                                <div className="grid gap-2">
                                    {results.climbs.map((climb) => (
                                        <Link
                                            key={climb.id}
                                            href={`/areas/${climb.section.crag.sector.area.name}/${climb.section.crag.sector.name}/${climb.section.crag.name}`}
                                            onClick={handleSelect}
                                            className="flex items-center gap-2 rounded-md p-2 hover:bg-accent"
                                        >
                                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                                {climb.grade}
                                            </div>
                                            <div className="flex flex-col">
                                                <span>{climb.display_name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {climb.section.crag.sector.area.display_name} / {climb.section.crag.display_name}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                        {query.length >= 2 &&
                            !loading &&
                            results.areas.length === 0 &&
                            results.sectors.length === 0 &&
                            results.crags.length === 0 &&
                            results.climbs.length === 0 && (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    No results found.
                                </div>
                            )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
