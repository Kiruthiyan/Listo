'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface TaskFormProps {
    onSuccess: () => void;
    initialData?: {
        title: string;
        description: string;
        subject?: string;
        status: 'TODO' | 'IN_PROGRESS' | 'DONE';
        priority: 'HIGH' | 'MEDIUM' | 'LOW';
        dueDate?: string;
    };
    taskId?: string; // If editing
}

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    subject: z.string().optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
    priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
    dueDate: z.string().optional(),
});

export default function TaskForm({ onSuccess, initialData, taskId }: TaskFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = !!taskId;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            subject: initialData?.subject || "",
            status: initialData?.status || "TODO",
            priority: initialData?.priority || "MEDIUM",
            dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().slice(0, 16) : "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // Format dueDate to ISO string if present, otherwise null
            const payload = {
                ...values,
                dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null
            };

            if (isEditing && taskId) {
                await api.put(`/tasks/${taskId}`, payload);
                toast.success("Task updated successfully");
            } else {
                await api.post('/tasks', payload);
                toast.success("Task created successfully");
                form.reset(); // Only reset form for new tasks
            }
            onSuccess();
        } catch (error) {
            toast.error(isEditing ? "Failed to update task" : "Failed to create task");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input {...form.register('title')} placeholder="Finish Assignment 3" />
                {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Subject / Course</label>
                <Input {...form.register('subject')} placeholder="e.g. DBMS, Math" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input {...form.register('description')} placeholder="Details about the task..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Due Date</label>
                    <Input type="datetime-local" {...form.register('dueDate')} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <select {...form.register('priority')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Task
                </Button>
            </div>
        </form>
    );
}
