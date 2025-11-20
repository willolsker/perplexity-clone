"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";

interface QueryFormProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export function QueryForm({ onSubmit, isLoading }: QueryFormProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      const currentQuery = query.trim();
      setQuery("");
      onSubmit(currentQuery);
    }
  };

  return (
    <motion.div
      layout
      transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="w-full relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything..."
            className="w-full px-6 py-4 pr-16 text-lg border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white placeholder-gray-400 shadow-lg"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full transition-colors flex items-center justify-center"
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
