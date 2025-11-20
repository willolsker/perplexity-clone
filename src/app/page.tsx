"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "~/utils/api";
import { QueryForm } from "~/components/QueryForm";
import { ResponseDisplay } from "~/components/ResponseDisplay";
import { SearchResultsSidebar } from "~/components/SearchResultsSidebar";
import { TopBar } from "~/components/TopBar";

export default function Home() {
  const [hasSearched, setHasSearched] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [highlightedCitation, setHighlightedCitation] = useState<number | null>(null);

  const searchMutation = api.search.query.useMutation();

  const handleSubmit = (searchQuery: string) => {
    setHasSearched(true);
    searchMutation.mutate({ query: searchQuery });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white relative selection:bg-blue-100 dark:selection:bg-blue-900 flex flex-col">
      {/* Top Bar - Only visible after search */}
      {hasSearched && (
        <TopBar 
          isSidebarOpen={isSidebarOpen} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
      )}

      {/* Sidebar */}
      <SearchResultsSidebar
        citations={searchMutation.data?.citations ?? []}
        highlightedIndex={highlightedCitation}
        isOpen={isSidebarOpen && hasSearched}
      />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ease-in-out flex-1 flex flex-col ${
          isSidebarOpen && hasSearched ? "mr-0 md:mr-80" : ""
        } ${hasSearched ? "pt-16" : ""}`}
      >
        <div className="container mx-auto px-4 pt-8 pb-32 max-w-4xl flex flex-col flex-1">
          
          {/* Header / Title - Animate out when searching */}
          <AnimatePresence>
            {!hasSearched && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, height: 0, marginBottom: 0 }}
                className="text-center mt-[20vh] mb-8"
              >
                <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                  Perplexity Clone
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Where knowledge begins
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Area */}
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1"
            >
              {searchMutation.isError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-800 dark:text-red-200">
                    Error: {searchMutation.error?.message ?? "Something went wrong"}
                  </p>
                </div>
              )}

              {searchMutation.isPending && (
                <div className="flex flex-col items-center justify-center mt-20 space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600 dark:text-gray-400 animate-pulse">
                    Thinking...
                  </span>
                </div>
              )}

              {searchMutation.isSuccess && searchMutation.data && (
                <ResponseDisplay
                  response={searchMutation.data.response}
                  onHoverCitation={setHighlightedCitation}
                />
              )}
            </motion.div>
          )}

          {/* Query Form - Animated Position */}
          <QueryForm
            onSubmit={handleSubmit}
            isLoading={searchMutation.isPending}
            mode={hasSearched ? "bottom" : "centered"}
            isSidebarOpen={isSidebarOpen && hasSearched}
          />
        </div>
      </div>
    </main>
  );
}
