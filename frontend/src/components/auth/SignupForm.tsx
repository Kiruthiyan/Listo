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
import { GraduationCap } from 'lucide-react';

const signupSchema = z.object({
    fullName: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormValues) => {
        setLoading(true);
        try {
            const res = await api.post('/auth/register', data);
            localStorage.setItem('token', res.data.token);
            toast.success('Account created successfully!');
            router.push('/dashboard');
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || (error.response?.data && JSON.stringify(error.response.data)) || error.message || 'Something went wrong';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="text-center space-y-2">
                <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-orange-400 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent pb-1">Join Listo</h1>
                <p className="text-sm text-muted-foreground">Start organizing your life today</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Input placeholder="Full Name" {...register('fullName')} />
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                    <Input type="email" placeholder="Email" {...register('email')} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <Input type="password" placeholder="Password" {...register('password')} />
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                    <Input type="password" placeholder="Confirm Password" {...register('confirmPassword')} />
                    {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
                </div>
                <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Sign Up'}
                </Button>
            </form>
        </div>
    );
}
