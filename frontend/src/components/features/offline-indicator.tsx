'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function OfflineIndicator() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        function onOffline() {
            setIsOffline(true);
            toast.error("You are offline. Changes may not be saved.", {
                duration: Infinity,
                id: 'offline-toast'
            });
        }

        function onOnline() {
            setIsOffline(false);
            toast.dismiss('offline-toast');
            toast.success("You are back online!", { duration: 3000 });
        }

        window.addEventListener('offline', onOffline);
        window.addEventListener('online', onOnline);

        return () => {
            window.removeEventListener('offline', onOffline);
            window.removeEventListener('online', onOnline);
        };
    }, []);

    return null;
}
