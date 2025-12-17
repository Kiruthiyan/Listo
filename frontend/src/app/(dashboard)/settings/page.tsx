'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Bell, Shield, Palette, Moon, Sun, LogOut, ChevronRight, Mail, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);

    useEffect(() => {
        // Initialize theme
        const stored = localStorage.getItem('theme');
        if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = (newTheme: 'light' | 'dark') => {
        setTheme(newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Clean up user data if exists
        toast.success("Logged out successfully");
        router.push('/login');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 md:pb-0">
            {/* Header */}
            <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-xs md:text-base text-muted-foreground">Manage your account and preferences.</p>
            </div>

            {/* Account Section */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">Account</h3>
                <Card className="border shadow-sm overflow-hidden">
                    <div className="divide-y divide-border/50">
                        {/* Profile Info */}
                        <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Profile Information</p>
                                    <p className="text-xs text-muted-foreground">Update your photo and details</p>
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>

                        {/* Password */}
                        <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Security</p>
                                    <p className="text-xs text-muted-foreground">Change password & 2FA</p>
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Appearance Section */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">Appearance</h3>
                <Card className="border shadow-sm">
                    <CardContent className="p-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <Palette className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Theme</p>
                                <p className="text-xs text-muted-foreground">Select app appearance</p>
                            </div>
                        </div>
                        <div className="flex items-center bg-secondary rounded-full p-1 border border-border/50">
                            <button
                                onClick={() => toggleTheme('light')}
                                className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-background shadow-sm text-sky-500' : 'text-muted-foreground'}`}
                            >
                                <Sun className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => toggleTheme('dark')}
                                className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-background shadow-sm text-sky-500' : 'text-muted-foreground'}`}
                            >
                                <Moon className="h-4 w-4" />
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Notifications Section */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">Notifications</h3>
                <Card className="border shadow-sm overflow-hidden">
                    <div className="divide-y divide-border/50">
                        <div className="p-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">Email Updates</span>
                                </div>
                            </div>
                            <Checkbox checked={emailNotifications} onCheckedChange={(c) => setEmailNotifications(!!c)} />
                        </div>
                        <div className="p-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
                                    <Bell className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">Push Notifications</span>
                                </div>
                            </div>
                            <Checkbox checked={pushNotifications} onCheckedChange={(c) => setPushNotifications(!!c)} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Logout Button */}
            <div className="pt-4">
                <Button variant="destructive" className="w-full md:w-auto md:min-w-[200px] h-11 shadow-lg shadow-destructive/20 rounded-xl" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
            </div>
        </div>
    );
}
