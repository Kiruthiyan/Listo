'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex h-screen flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-4xl font-bold">404</h2>
            <p className="text-xl text-muted-foreground">Page not found</p>
            <div className="pt-4">
                <Button asChild>
                    <Link href="/dashboard">Return Home</Link>
                </Button>
            </div>
        </div>
    );
}
