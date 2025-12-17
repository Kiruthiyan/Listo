'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    BarChart,
    CheckSquare,
    Settings,
    LogOut,
    Calendar,
    Menu,
    X,
    GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import MobileNav from '@/components/layout/MobileNav';

/* ... imports ... */

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const navigation = [
        { name: 'Overview', href: '/dashboard', icon: BarChart },
        { name: 'Tasks', href: '/tasks', icon: CheckSquare },
        { name: 'Calendar', href: '/calendar', icon: Calendar },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
                {/* ... Keep Sidebar Content ... */}
                <div className="p-6 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                        <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                        Listo
                    </span>
                </div>
                <nav className="flex-1 space-y-1 px-4">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                                pathname === item.href
                                    ? "bg-accent text-accent-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-border">
                    <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                        <LogOut className="mr-3 h-5 w-5" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
                    <div className="max-w-5xl mx-auto w-full">
                        {children}
                    </div>
                </main>

                {/* Mobile Bottom Nav */}
                <MobileNav />
            </div>
        </div>
    );
}
