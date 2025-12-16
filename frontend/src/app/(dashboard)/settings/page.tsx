'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Bell, Moon, Sun, User, LogOut, Lock } from 'lucide-react';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { PasswordForm } from "@/components/settings/PasswordForm";

export default function SettingsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        // Initialize theme from localStorage or DOM
        const isDark = document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
        setTheme(isDark ? 'dark' : 'light');
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark'); // Default to light if preferred
            // Note: Our globals.css defaults to light if no class used, but we should be explicit if we use class strategy.
        }
    }, []);

    const handleThemeChange = (newTheme: string) => {
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
        router.push('/login');
        toast.success("Logged out successfully");
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-10">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account and preferences.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Account
                    </CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileForm />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Security
                    </CardTitle>
                    <CardDescription>Manage your password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PasswordForm />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sun className="h-5 w-5" />
                        Appearance
                    </CardTitle>
                    <CardDescription>Customize the look and feel.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Theme</p>
                        <p className="text-sm text-muted-foreground">Select your preferred theme.</p>
                    </div>
                    <div className="flex gap-2 bg-secondary p-1 rounded-lg">
                        <Button
                            variant={theme === 'light' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handleThemeChange('light')}
                            className={theme === 'light' ? 'bg-background text-foreground shadow-sm' : ''}
                        >
                            <Sun className="h-4 w-4 mr-2" /> Light
                        </Button>
                        <Button
                            variant={theme === 'dark' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handleThemeChange('dark')}
                            className={theme === 'dark' ? 'bg-background text-foreground shadow-sm' : ''}
                        >
                            <Moon className="h-4 w-4 mr-2" /> Dark
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                    </CardTitle>
                    <CardDescription>Configure how you receive alerts.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates about your tasks.</p>
                    </div>
                    <Button variant={notifications ? 'default' : 'outline'} onClick={() => setNotifications(!notifications)}>
                        {notifications ? 'Enabled' : 'Disabled'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                        <LogOut className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>Actions that cannot be undone.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" onClick={handleLogout}>Log Out</Button>
                </CardContent>
            </Card>
        </div>
    );
}

