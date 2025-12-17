import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2 } from "lucide-react";

interface RecentActivityProps {
    tasks: any[]; // Using any for task type for now, or import Task type
}

export default function RecentActivity({ tasks = [] }: RecentActivityProps) {
    // Filter for DONE tasks and Sort by update time (assuming updatedAt exists, else createdAt)
    // Since backend might not return updatedAt for simple list, we use 'createdAt' or just display recent 'DONE'
    const completedTasks = tasks && Array.isArray(tasks) ? tasks
        .filter(t => t.status === 'DONE') : [];

    const sortedTasks = completedTasks.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
        .slice(0, 5);

    return (
        <Card className="col-span-1 h-full">
            <CardHeader>
                <CardTitle className="text-base md:text-2xl font-semibold">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
                {completedTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <p>No completed tasks yet.</p>
                        <p className="text-xs">Finish a task to see it here!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {completedTasks.map((task) => (
                            <div key={task.id} className="flex items-start">
                                <Avatar className="h-8 w-8 mt-1">
                                    <AvatarFallback className="text-xs bg-green-100 text-green-700">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none line-through text-muted-foreground">{task.title}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] uppercase font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">
                                            {task.subject || 'General'}
                                        </span>
                                        <p className="text-xs text-muted-foreground">
                                            {task.updatedAt ? formatDistanceToNow(new Date(task.updatedAt)) + ' ago' : 'Recently'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
