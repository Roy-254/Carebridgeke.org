"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-9 h-9 p-0 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)]"
            aria-label="Toggle theme"
        >
            {theme === "light" ? (
                <Moon className="w-5 h-5 text-[var(--text-secondary)]" />
            ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
            )}
        </Button>
    );
}
