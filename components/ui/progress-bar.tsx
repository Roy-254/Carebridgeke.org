"use client";

import { cn } from "@/lib/utils";
import { calculatePercentage } from "@/lib/utils";

type ProgressBarProps =
    | {
        /** Direct percentage value (0-100). Use for step wizards where there is no current/target. */
        progress: number;
        current?: never;
        target?: never;
        className?: string;
        showPercentage?: boolean;
        size?: "sm" | "md" | "lg";
    }
    | {
        /** Current fundraising amount. Used together with `target`. */
        current: number;
        /** Target fundraising amount. Used together with `current`. */
        target: number;
        progress?: never;
        className?: string;
        showPercentage?: boolean;
        size?: "sm" | "md" | "lg";
    };

export function ProgressBar({
    current,
    target,
    progress,
    className,
    showPercentage = false,
    size = "md",
}: ProgressBarProps) {
    const percentage =
        progress !== undefined
            ? Math.min(100, Math.max(0, progress))
            : calculatePercentage(current as number, target as number);

    const sizes = {
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
    };

    return (
        <div className={cn("w-full", className)}>
            <div className={cn("w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden", sizes[size])}>
                <div
                    className="h-full bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-blue)] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showPercentage && (
                <p className="text-sm text-[var(--text-secondary)] mt-1 text-right font-mono">
                    {percentage}%
                </p>
            )}
        </div>
    );
}
