"use client";

import { useState } from "react";
import { motion } from "motion/react";

interface QueryFormProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  mode?: "centered" | "bottom";
  isSidebarOpen?: boolean;
}

export function QueryForm({ onSubmit, isLoading, mode = "centered", isSidebarOpen = false }: QueryFormProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
    }
  };

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        ...(mode === "centered"
          ? {
              position: "relative",
              bottom: "auto",
              left: "auto",
              x: 0,
              width: "100%",
              zIndex: 10,
            }
          : {
              position: "fixed",
              bottom: 24,
              // Adjust left/width based on sidebar state
              left: isSidebarOpen ? "calc(50% - 160px)" : "50%",
              x: "-50%",
              width: isSidebarOpen ? "calc(90% - 320px)" : "90%",
              maxWidth: "48rem",
              zIndex: 50,
            }),
      }}
      transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
      className={mode === "centered" ? "" : "px-4 md:px-0"}
    >
      <form onSubmit={handleSubmit} className="w-full relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything..."
            disabled={isLoading}
            className="w-full px-6 py-4 pr-32 text-lg border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full font-medium transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              </span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
