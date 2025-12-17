'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, ArrowRight, Loader2, User, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';

export function MobileSignup() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            // Destructure to exclude confirmPassword from API call if backend doesn't want it, 
            // but keep it if SignupForm sends it. SignupForm sends {fullName, email, password, confirmPassword} to /auth/register?
            // Checking SignupForm (Step 3182), it sends ALL data. So I will send all.
            await api.post('/auth/register', formData);
            toast.success("Account created successfully", {
                description: "You can now login."
            });
            router.push('/login');
        } catch (error: any) {
            toast.error("Registration failed", {
                description: error.response?.data?.message || "Please check your details"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Abstract Background Effects */}
            <div className="absolute top-0 left-0 -ml-20 -mt-20 h-72 w-72 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 -mr-20 -mb-20 h-72 w-72 bg-sky-500/10 rounded-full blur-3xl"></div>

            <Card className="w-full max-w-md border-0 ring-1 ring-border/50 shadow-2xl bg-card/50 backdrop-blur-xl relative z-10 animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
                <CardHeader className="space-y-4 text-center pb-6">
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/30 ring-4 ring-background">
                        <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                            Join Listo
                        </CardTitle>
                        <CardDescription className="text-base">
                            Create your account to start organizing.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium ml-1">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Enter your full name"
                                    className="pl-9 h-11 bg-background/50 border-input/60 focus:border-sky-500 focus:ring-sky-500/20 transition-all rounded-xl shadow-sm"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

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
                            <Label className="text-sm font-medium ml-1">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="Create a password"
                                    className="pl-9 h-11 bg-background/50 border-input/60 focus:border-sky-500 focus:ring-sky-500/20 transition-all rounded-xl shadow-sm"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium ml-1">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="Confirm your password"
                                    className="pl-9 h-11 bg-background/50 border-input/60 focus:border-sky-500 focus:ring-sky-500/20 transition-all rounded-xl shadow-sm"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 shadow-lg shadow-orange-500/25 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
                            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground pt-2">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-sky-500 hover:text-sky-600 hover:underline transition-colors">
                            Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
