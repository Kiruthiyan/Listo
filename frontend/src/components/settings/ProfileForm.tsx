'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

const profileSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialEmail, setInitialEmail] = useState('');

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/me');
                const { fullName, email } = res.data;
                setValue('fullName', fullName);
                setValue('email', email);
                setInitialEmail(email);
            } catch (error) {
                console.error("Failed to load profile", error);
                toast.error("Failed to load profile data");
            }
        };
        fetchProfile();
    }, [setValue]);

    const onSubmit = async (data: ProfileFormValues) => {
        setLoading(true);
        try {
            await api.put('/users/me', data);
            toast.success("Profile updated successfully");

            // If email changed, logout
            if (data.email !== initialEmail) {
                toast.info("Email changed. Please log in again.");
                localStorage.removeItem('token');
                router.push('/login');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Your Name" {...register('fullName')} />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" {...register('email')} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                <p className="text-xs text-muted-foreground">Changing your email will log you out.</p>
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
}
