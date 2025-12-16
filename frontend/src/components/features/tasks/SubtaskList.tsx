'use client';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Loader2, Pencil, Check, X } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

interface SubtaskListProps {
    taskId: string;
    subtasks: Subtask[];
    onUpdate: () => void; // Trigger refresh of parent task list
}

export default function SubtaskList({ taskId, subtasks: initialSubtasks, onUpdate }: SubtaskListProps) {
    const [subtasks, setSubtasks] = useState<Subtask[]>(initialSubtasks);
    const [newTitle, setNewTitle] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Calculate Progress
    const completedCount = subtasks.filter(s => s.completed).length;
    const progress = subtasks.length === 0 ? 0 : (completedCount / subtasks.length) * 100;

    const addSubtask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        setIsAdding(true);

        const tempId = Math.random().toString();
        const optimisticSubtask: Subtask = { id: tempId, title: newTitle, completed: false };
        setSubtasks([...subtasks, optimisticSubtask]);
        setNewTitle('');

        try {
            await api.post(`/tasks/${taskId}/subtasks`, { title: newTitle, completed: false });
            onUpdate(); // Re-fetch to get real ID
        } catch (error) {
            setSubtasks(subtasks); // Revert
            toast.error("Failed to add subtask");
        } finally {
            setIsAdding(false);
        }
    };

    const toggleSubtask = async (subtask: Subtask) => {
        const updated = { ...subtask, completed: !subtask.completed };
        const originalList = [...subtasks];

        setSubtasks(subtasks.map(s => s.id === subtask.id ? updated : s));

        try {
            await api.put(`/subtasks/${subtask.id}`, { completed: updated.completed });
        } catch (error) {
            setSubtasks(originalList);
            toast.error("Failed to update subtask");
        }
    };

    const deleteSubtask = async (id: string) => {
        const originalList = [...subtasks];
        setSubtasks(subtasks.filter(s => s.id !== id));

        try {
            await api.delete(`/subtasks/${id}`);
            // No need to onUpdate here if local state is fine, but good to sync
            onUpdate();
        } catch (error) {
            setSubtasks(originalList);
            toast.error("Failed to delete subtask");
        }
    };

    const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const startEditing = (subtask: Subtask) => {
        setEditingSubtaskId(subtask.id);
        setEditTitle(subtask.title);
    };

    const saveEdit = async (subtask: Subtask) => {
        if (!editTitle.trim()) return;

        const updated = { ...subtask, title: editTitle };
        setSubtasks(subtasks.map(s => s.id === subtask.id ? updated : s));
        setEditingSubtaskId(null);

        try {
            await api.put(`/subtasks/${subtask.id}`, { title: editTitle });
            onUpdate();
        } catch (error) {
            toast.error("Failed to update subtask");
        }
    };

    const cancelEdit = () => {
        setEditingSubtaskId(null);
        setEditTitle('');
    };

    return (
        <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Subtasks ({completedCount}/{subtasks.length})</span>
                <span>{Math.round(progress)}%</span>
            </div>

            {subtasks.length > 0 && <Progress value={progress} className="h-1.5 mb-4" />}

            <div className="space-y-2">
                {subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-2 group min-h-[2rem]">
                        <Checkbox
                            checked={subtask.completed}
                            onCheckedChange={() => toggleSubtask(subtask)}
                        />

                        {editingSubtaskId === subtask.id ? (
                            <div className="flex-1 flex items-center gap-1">
                                <Input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="h-7 text-sm"
                                    autoFocus
                                />
                                <Button size="icon" variant="ghost" className="h-6 w-6 text-green-500" onClick={() => saveEdit(subtask)}><Check className="h-3 w-3" /></Button>
                                <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={cancelEdit}><X className="h-3 w-3" /></Button>
                            </div>
                        ) : (
                            <>
                                <span className={`text-sm flex-1 ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                                    {subtask.title}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/10 mr-1"
                                    onClick={() => startEditing(subtask)}
                                >
                                    <Pencil className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                                    onClick={() => deleteSubtask(subtask.id)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <form onSubmit={addSubtask} className="flex gap-2 items-center mt-2">
                <Plus className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Add subtask..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="h-8 text-sm"
                />
            </form>
        </div>
    );
}
