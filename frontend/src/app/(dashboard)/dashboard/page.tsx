'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, GraduationCap, Bell } from 'lucide-react';
import api from '@/lib/axios';
import { TaskStatistics } from '@/types/dashboard';
import StatsCards from '@/components/features/dashboard/StatsCards';
import RecentActivity from '@/components/features/dashboard/RecentActivity';
import ProgressRing from '@/components/features/dashboard/ProgressRing';
import DashboardCalendar from '@/components/features/dashboard/DashboardCalendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<TaskStatistics | null>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ name: string } | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [userRes, statsRes, tasksRes] = await Promise.all([
                    api.get('/users/me'),
                    api.get('/tasks/stats'),
                    api.get('/tasks')
                ]);

                setUser({ name: userRes.data.fullName });
                setStats(statsRes.data);
                // Ensure we pass an array
                setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                toast.error("Failed to load dashboard metrics");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-10">
            {/* Header Section */}
            <div className="flex md:hidden flex-col gap-4 pb-2 pt-2">
                <div className="flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-sky-400/20 to-blue-600/20 ring-1 ring-sky-500/30 backdrop-blur-md shadow-sm">
                            <GraduationCap className="h-6 w-6 text-sky-500 fill-sky-500/20" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-sky-500 font-sans leading-none">Listo</h1>
                    </div>
                    {/* Notification Bell */}
                    <div className="relative">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-sky-500/10 transition-colors">
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse"></span>
                            <Bell className="h-5 w-5 text-sky-950 dark:text-sky-100" />
                        </Button>
                    </div>
                </div>

                {/* Unique Mobile Welcome Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-sky-400 p-6 shadow-lg shadow-sky-500/25">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-1">Hello, {user?.name?.split(' ')[0] || 'Student'}! 👋</h2>
                        <p className="text-blue-50 font-medium">Ready to conquer your tasks today?</p>
                    </div>
                </div>
            </div>

            {/* DESKTOP ONLY Header: Standard Greeting */}
            <div className="hidden md:flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                <div>
                    <h2 className="text-xl md:text-3xl font-bold tracking-tight">
                        Hello, <span className="text-primary">{user?.name?.split(' ')[0]}</span>
                    </h2>
                    <p className="text-xs md:text-base text-muted-foreground mt-1">Here is your daily overview.</p>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                    <Button onClick={() => router.push('/tasks')} className="bg-primary hover:bg-primary/90 shadow-md">
                        <Plus className="mr-2 h-4 w-4" /> New Task
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            {stats && <StatsCards stats={stats} />}

            {/* Main Grid: Progress & Activity */}
            <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-7">

                {/* Visual Motivation - Progress Ring */}
                <div className="lg:col-span-2">
                    <Card className="h-full border-none shadow-sm md:bg-card/50 md:ring-1 md:ring-inset md:ring-muted/50 
                        bg-gradient-to-b from-card to-sky-500/5 shadow-[0_0_15px_-3px_rgba(14,165,233,0.15)] ring-1 ring-sky-500/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-center font-medium bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-blue-500">Your Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center pb-4 pt-2">
                            {stats && (
                                <ProgressRing
                                    completed={stats.completedTasks}
                                    total={stats.totalTasks}
                                    size={140}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity Feed - Wrapped with Mobile Style */}
                <div className="lg:col-span-3 rounded-xl overflow-hidden shadow-[0_0_15px_-3px_rgba(14,165,233,0.15)] ring-1 ring-sky-500/20 md:shadow-none md:ring-0">
                    <RecentActivity tasks={tasks} />
                </div>

                {/* Premium Calendar Widget - Wrapped with Mobile Style */}
                <div className="lg:col-span-2 rounded-xl overflow-hidden shadow-[0_0_15px_-3px_rgba(14,165,233,0.15)] ring-1 ring-sky-500/20 md:shadow-none md:ring-0">
                    <DashboardCalendar tasks={tasks} />
                </div>
            </div>
        </div>
    );
}
