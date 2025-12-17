export interface TaskStatistics {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    dueToday: number;
    dueThisWeek: number;
    examCount: number;
    priorityBreakdown: Record<string, number>;
}
