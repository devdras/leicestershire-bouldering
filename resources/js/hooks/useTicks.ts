import { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';

export interface Tick {
    id: number | string; // string for local IDs
    climb_id: number;
    date: string;
    style?: string;
    notes?: string;
    climb?: any;
}

export function useTicks() {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const [ticks, setTicks] = useState<Tick[]>([]);

    useEffect(() => {
        if (user) {
            // Fetch from API if logged in
            fetch('/ticks')
                .then(res => res.json())
                .then(data => setTicks(data));
        } else {
            // Fetch from LocalStorage if not
            const localTicks = JSON.parse(localStorage.getItem('ticks') || '[]');
            setTicks(localTicks);
        }
    }, [user]);

    const addTick = (climbId: number, date: string, style?: string, notes?: string) => {
        if (user) {
            router.post('/ticks', {
                climb_id: climbId,
                date,
                style,
                notes,
            }, {
                onSuccess: () => {
                    // Optimistic update or re-fetch
                    fetch('/ticks')
                        .then(res => res.json())
                        .then(data => setTicks(data));
                }
            });
        } else {
            const newTick: Tick = {
                id: crypto.randomUUID(),
                climb_id: climbId,
                date,
                style,
                notes,
            };
            const updatedTicks = [...ticks, newTick];
            setTicks(updatedTicks);
            localStorage.setItem('ticks', JSON.stringify(updatedTicks));
        }
    };

    const removeTick = (climbId: number) => {
        const tick = ticks.find(t => t.climb_id === climbId);
        if (!tick) return;

        if (user) {
            router.delete(`/ticks/${tick.id}`, {
                onSuccess: () => {
                    setTicks(ticks.filter(t => t.id !== tick.id));
                }
            });
        } else {
            const updatedTicks = ticks.filter(t => t.climb_id !== climbId);
            setTicks(updatedTicks);
            localStorage.setItem('ticks', JSON.stringify(updatedTicks));
        }
    };

    const isTicked = (climbId: number) => {
        return ticks.some(t => t.climb_id === climbId);
    };

    const getTickByClimbId = (climbId: number) => {
        return ticks.find(t => t.climb_id === climbId);
    };

    const getTickedCount = (climbIds: number[]) => {
        return climbIds.filter((id) => isTicked(id)).length;
    };

    return { ticks, addTick, removeTick, isTicked, getTickByClimbId, getTickedCount };
}
