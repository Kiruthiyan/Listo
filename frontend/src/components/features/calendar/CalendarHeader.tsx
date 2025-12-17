import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CalendarHeaderProps {
    date: Date;
    view: 'month' | 'week' | 'day';
    onViewChange: (view: 'month' | 'week' | 'day') => void;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
}

export default function CalendarHeader({ date, view, onViewChange, onPrev, onNext, onToday }: CalendarHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold tracking-tight min-w-[200px]">
                        {format(date, view === 'day' ? 'MMMM d, yyyy' : 'MMMM yyyy')}
                    </h2>
                    {view === 'week' && (
                        <span className="text-muted-foreground text-sm font-medium pt-1">
                            Week {format(date, 'w')}
                        </span>
                    )}
                </div>
                <div className="flex items-center rounded-md border shadow-sm bg-background">
                    <Button variant="ghost" size="icon" onClick={onPrev} className="h-8 w-8 rounded-none rounded-l-md border-r">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onToday} className="h-8 rounded-none border-r px-3 font-medium">
                        Today
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onNext} className="h-8 w-8 rounded-none rounded-r-md">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Tabs value={view} onValueChange={(v) => onViewChange(v as any)} className="w-full md:w-auto">
                <TabsList className="grid w-full grid-cols-3 md:w-auto">
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="day">Day</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
}
