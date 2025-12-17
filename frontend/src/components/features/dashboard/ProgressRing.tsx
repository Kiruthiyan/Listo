import { cn } from "@/lib/utils";
import { CheckCircle2, Trophy } from "lucide-react";

interface ProgressRingProps {
    completed: number;
    total: number;
    size?: number;
    strokeWidth?: number;
}

export default function ProgressRing({ completed, total, size = 180, strokeWidth = 12 }: ProgressRingProps) {
    // Safety check for Total to avoid NaN
    const safeTotal = Math.max(total, 0);
    const safeCompleted = Math.min(Math.max(completed, 0), safeTotal);

    // Ensure percentage is valid number
    const percentage = safeTotal === 0 ? 0 : Math.round((safeCompleted / safeTotal) * 100);

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative flex items-center justify-center">
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="transform -rotate-90 transition-all duration-1000 ease-in-out"
                >
                    {/* Background Circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        className="text-muted/10"
                    />
                    {/* Progress Circle - Gradient ID reference? SVG doesn't support class gradients easily on stroke. 
                        We use Token Color (Primary) */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="text-primary transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-extrabold tracking-tight text-foreground">{percentage}%</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Complete</span>
                </div>
            </div>

            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                        {safeCompleted} of {safeTotal} Tasks Done
                    </span>
                </div>
                {percentage === 100 && safeTotal > 0 && (
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                        <Trophy className="mr-1 h-3 w-3" /> Champion!
                    </div>
                )}
            </div>
        </div>
    );
}
