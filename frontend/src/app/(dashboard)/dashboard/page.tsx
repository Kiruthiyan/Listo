'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';

interface DashboardStats {
    total: number;
    completed: number;
    pending: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({ total: 0, completed: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ name: string } | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await api.get('/users/me');
                setUser({ name: res.data.fullName });
            } catch (error) {
                console.error("Failed to fetch user");
            }
        };

        const fetchStats = async () => {
            try {
                const res = await api.get('/tasks');
                const tasks = res.data;
                setStats({
                    total: tasks.length,
                    completed: tasks.filter((t: any) => t.status === 'DONE').length,
                    pending: tasks.filter((t: any) => t.status !== 'DONE').length
                });
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Welcome back, <span className="text-primary">{user?.name}</span> 👋
                </h2>
                <p className="text-muted-foreground">Here's what's happening with your studies today.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">Active assignments & exams</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completed}</div>
                        <p className="text-xs text-muted-foreground">Tasks finished so far</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">Remaining workload</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.total === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <CheckCircle2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-medium">All caught up!</h3>
                                <p className="text-sm text-muted-foreground">You have no pending tasks. Enjoy your day 🎉</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">Your recent tasks will appear here.</p>
                                {/* We can list top 5 recent tasks here later */}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Upcoming Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Placeholder for future implementation */}
                            <p className="text-sm text-muted-foreground">No immediate deadlines.</p>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
