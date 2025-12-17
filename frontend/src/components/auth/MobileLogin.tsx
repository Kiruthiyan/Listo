'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, ArrowRight, Loader2, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';

export function MobileLogin() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await api.post('/auth/authenticate', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            toast.success("Welcome back!", {
                description: "You have successfully logged in."
            });
            router.push('/dashboard');
        } catch (error: any) {
            toast.error("Login failed", {
                description: error.response?.data?.message || "Please check your credentials"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Abstract Background Effects */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 bg-sky-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 bg-blue-500/10 rounded-full blur-3xl"></div>

            <Card className="w-full max-w-md border-0 ring-1 ring-border/50 shadow-2xl bg-card/50 backdrop-blur-xl relative z-10 animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
                <CardHeader className="space-y-4 text-center pb-8">
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30 ring-4 ring-background">
                        <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-base">
                            Sign in to continue to <span className="text-sky-500 font-semibold">Listo</span>
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium ml-1">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-9 h-11 bg-background/50 border-input/60 focus:border-sky-500 focus:ring-sky-500/20 transition-all rounded-xl shadow-sm"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <Label className="text-sm font-medium">Password</Label>
                                <Link href="/forgot-password" className="text-xs font-medium text-sky-500 hover:text-sky-600 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="pl-9 h-11 bg-background/50 border-input/60 focus:border-sky-500 focus:ring-sky-500/20 transition-all rounded-xl shadow-sm"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-sky-500/25 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground pt-2">
                        Don't have an account?{' '}
                        <Link href="/signup" className="font-semibold text-sky-500 hover:text-sky-600 hover:underline transition-colors">
                            Create Account
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
