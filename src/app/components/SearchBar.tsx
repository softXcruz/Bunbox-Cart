"use client";

// Import libraries
import { X, Search } from "lucide-react";

// Props type
type SearchBarProps = {
    query: string;
    setQuery: (value: string) => void;
    className?: string;
};

// Search bar component
export default function SearchBar({ query, setQuery, className = "" }: SearchBarProps) {
    return (
        <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className={`group relative ${className}`}
        >
            <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-orange-500 dark:text-neutral-500"
            />
            <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search burgers, fries..."
                aria-label="Search products"
                className="h-9 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-10 pr-9 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-orange-500 dark:focus:bg-neutral-900 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
                <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400 transition-colors hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200"
                >
                    <X size={16} />
                </button>
            )}
        </form>
    );
}