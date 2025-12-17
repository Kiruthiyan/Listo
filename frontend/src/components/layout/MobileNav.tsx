'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, ListTodo, CalendarDays, UserCircle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import TaskForm from '@/components/features/tasks/TaskForm';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useState } from 'react';

export default function MobileNav() {
    const pathname = usePathname();
    const isDesktop = false;
    const [open, setOpen] = useState(false);

    const navItems = [
        { href: '/dashboard', label: 'Home', icon: LayoutGrid },
        { href: '/tasks', label: 'My Tasks', icon: ListTodo },
        { href: 'ADD', label: 'Create', icon: Plus },
        { href: '/calendar', label: 'Schedule', icon: CalendarDays },
        { href: '/settings', label: 'Profile', icon: UserCircle },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 z-50 h-[70px] pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around items-end h-full px-2 pb-3">
                {navItems.map((item) => {
                    const isActive = item.href !== 'ADD' && pathname.startsWith(item.href);

                    if (item.href === 'ADD') {
                        return (
                            <Drawer key="add-task" open={open} onOpenChange={setOpen}>
                                <DrawerTrigger asChild>
                                    <div className="relative -top-6 group cursor-pointer">
                                        {/* Glow Layer */}
                                        <div className="absolute inset-0 rounded-full bg-sky-500 blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>

                                        {/* Main Button */}
                                        <div className="relative h-16 w-16 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center shadow-xl shadow-sky-500/30 ring-4 ring-background transition-transform transform group-hover:scale-105 active:scale-95">
                                            <Plus className="h-8 w-8 text-white" strokeWidth={3} />
                                        </div>
                                    </div>
                                </DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader className="sr-only">
                                        <DrawerTitle>Create New Task</DrawerTitle>
                                        <DrawerDescription>Fill out the form to add a new task.</DrawerDescription>
                                    </DrawerHeader>
                                    <div className="p-4 pb-8">
                                        <h3 className="text-lg font-semibold mb-4 ml-1">New Task</h3>
                                        <TaskForm onSuccess={() => setOpen(false)} />
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full space-y-1 transition-all duration-300 pb-2 active:scale-95 group",
                                isActive ? "text-sky-500" : "text-muted-foreground/60 hover:text-foreground"
                            )}
                        >
                            <div className={cn("relative p-1.5 rounded-xl transition-all duration-300", isActive && "bg-sky-500/10")}>
                                <item.icon
                                    className={cn(
                                        "h-6 w-6 transition-all duration-300",
                                        isActive ? "stroke-[2.5px] drop-shadow-[0_0_8px_rgba(14,165,233,0.6)]" : "stroke-[1.5px]"
                                    )}
                                />
                            </div>
                            {/* <span className={cn("text-[9px] font-bold tracking-wide uppercase opacity-0 transition-all duration-300 transform translate-y-2", isActive && "opacity-100 translate-y-0")}>{item.label}</span> */}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
