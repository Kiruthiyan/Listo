'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from '@/lib/axios';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true);
        try {
            const res = await api.post('/auth/authenticate', data);
            localStorage.setItem('token', res.data.token);
            toast.success('Logged in successfully');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="text-center space-y-2">
                <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                    <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent pb-1">Welcome Back</h1>
                <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Input type="email" placeholder="Email" {...register('email')} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <Input type="password" placeholder="Password" {...register('password')} />
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                    <div className="flex justify-end">
                        <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                </div>
                <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Sign In'}
                </Button>
            </form>
        </div>
    );
}
