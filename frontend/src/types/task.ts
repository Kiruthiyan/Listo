export interface SubTask {
    id: number;
    title: string;
    completed: boolean;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    dueDate: string;
    subject?: string;
    subtasks: SubTask[];
}
