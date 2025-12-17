import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Calendar, CheckCircle2, GraduationCap, TrendingUp } from "lucide-react";
import { TaskStatistics } from "@/types/dashboard";

interface StatsCardsProps {
    stats: TaskStatistics;
}

export default function StatsCards({ stats }: StatsCardsProps) {
    return (
        <>
            {/* MOBILE VIEW: Compact Premium Horizontal Scroll */}
            <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-3 pb-2 no-scrollbar px-1">

                {/* Overdue */}
                <Card className="min-w-[210px] h-[125px] snap-center shadow-md border-none bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden group rounded-2xl">
                    <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
                        <AlertCircle className="h-20 w-20" />
                    </div>
                    <CardContent className="p-4 flex flex-col justify-between h-full relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100/80">Overdue</p>
                                <div className="text-3xl font-bold tracking-tight mt-0.5">{stats.overdueTasks}</div>
                            </div>
                            <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-full"><AlertCircle className="h-3.5 w-3.5" /></div>
                        </div>

                        <div>
                            <div className="h-1 bg-black/20 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-white/90 w-[70%]" />
                            </div>
                            <p className="text-[10px] font-medium text-blue-100 flex items-center gap-1">
                                {stats.overdueTasks > 0 ? "Requires attention" : "On track"}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Due Today */}
                <Card className="min-w-[210px] h-[125px] snap-center shadow-md border-none bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden group rounded-2xl">
                    <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
                        <Calendar className="h-20 w-20" />
                    </div>
                    <CardContent className="p-4 flex flex-col justify-between h-full relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-purple-100/80">Today</p>
                                <div className="text-3xl font-bold tracking-tight mt-0.5">{stats.dueToday}</div>
                            </div>
                            <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-full"><Calendar className="h-3.5 w-3.5" /></div>
                        </div>

                        <div>
                            <div className="h-1 bg-black/20 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-white/90 w-[45%]" />
                            </div>
                            <p className="text-[10px] font-medium text-purple-100">Daily tasks</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Exams */}
                <Card className="min-w-[210px] h-[125px] snap-center shadow-md border-none bg-gradient-to-br from-orange-500 to-rose-600 text-white relative overflow-hidden group rounded-2xl">
                    <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
                        <GraduationCap className="h-20 w-20" />
                    </div>
                    <CardContent className="p-4 flex flex-col justify-between h-full relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-orange-100/80">Exams</p>
                                <div className="text-3xl font-bold tracking-tight mt-0.5">{stats.examCount}</div>
                            </div>
                            <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-full"><GraduationCap className="h-3.5 w-3.5" /></div>
                        </div>

                        <div>
                            <div className="h-1 bg-black/20 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-white/90 w-[30%]" />
                            </div>
                            <p className="text-[10px] font-medium text-orange-100">{stats.examCount > 0 ? "Upcoming" : "None"}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* This Week */}
                <Card className="min-w-[210px] h-[125px] snap-center shadow-md border-none bg-gradient-to-br from-emerald-500 to-teal-600 text-white relative overflow-hidden group rounded-2xl">
                    <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
                        <TrendingUp className="h-20 w-20" />
                    </div>
                    <CardContent className="p-4 flex flex-col justify-between h-full relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100/80">This Week</p>
                                <div className="text-3xl font-bold tracking-tight mt-0.5">{stats.dueThisWeek}</div>
                            </div>
                            <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-full"><TrendingUp className="h-3.5 w-3.5" /></div>
                        </div>

                        <div>
                            <div className="h-1 bg-black/20 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-white/90 w-[60%]" />
                            </div>
                            <p className="text-[10px] font-medium text-emerald-100">Workload</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* DESKTOP VIEW: Grid Layout (Original Style Preserved) */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Overdue */}
                <Card className="shadow-sm hover:shadow-md transition-all border-none bg-card/50 ring-1 ring-inset ring-muted hover:ring-destructive/20 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium text-muted-foreground group-hover:text-destructive transition-colors">Overdue Tasks</CardTitle>
                        <AlertCircle className="h-5 w-5 text-muted-foreground group-hover:text-destructive transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl md:text-4xl font-bold tracking-tight">{stats.overdueTasks}</div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {stats.overdueTasks > 0 ? "Requires attention" : "Everything on track"}
                        </p>
                    </CardContent>
                </Card>

                {/* Due Today */}
                <Card className="shadow-sm hover:shadow-md transition-all border-none bg-card/50 ring-1 ring-inset ring-muted hover:ring-primary/20 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium text-muted-foreground group-hover:text-primary transition-colors">Due Today</CardTitle>
                        <Calendar className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl md:text-4xl font-bold tracking-tight">{stats.dueToday}</div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {stats.dueToday > 0 ? "Tasks for today" : "No deadlines today"}
                        </p>
                    </CardContent>
                </Card>

                {/* Exams */}
                <Card className="shadow-sm hover:shadow-md transition-all border-none bg-card/50 ring-1 ring-inset ring-muted hover:ring-primary/20 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium text-muted-foreground group-hover:text-primary transition-colors">Exams</CardTitle>
                        <GraduationCap className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl md:text-4xl font-bold tracking-tight">{stats.examCount}</div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {stats.examCount > 0 ? "Upcoming assessments" : "No exams detected"}
                        </p>
                    </CardContent>
                </Card>

                {/* Weekly */}
                <Card className="shadow-sm hover:shadow-md transition-all border-none bg-card/50 ring-1 ring-inset ring-muted hover:ring-primary/20 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium text-muted-foreground group-hover:text-primary transition-colors">This Week</CardTitle>
                        <TrendingUp className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl md:text-4xl font-bold tracking-tight">{stats.dueThisWeek}</div>
                        <p className="text-sm text-muted-foreground mt-1">Total workload</p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
