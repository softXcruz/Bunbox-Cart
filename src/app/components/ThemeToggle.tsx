"use client";

// Import libraries
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

// Initialize the toggle button
export default function ThemeToggle() {
    // Define the state for the toggle theme
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="relative flex size-10 cursor-pointer items-center justify-center rounded-full text-neutral-700 outline-none transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-orange-500/40 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
            <Sun className="size-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
        </button>
    );
}