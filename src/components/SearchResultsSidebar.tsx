import { motion, AnimatePresence } from "motion/react";
import { Citation } from "./Citation";
import { Source } from "./ResponseDisplay";

interface SearchResultsSidebarProps {
  citations: Source[];
  highlightedIndex: number | null;
  isOpen: boolean;
}

export function SearchResultsSidebar({
  citations,
  highlightedIndex,
  isOpen,
}: SearchResultsSidebarProps) {
  return (
    <div className="fixed right-0 top-16 bottom-0 pointer-events-none z-20">
      {/* Sidebar Content */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="pointer-events-auto w-80 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-lg overflow-y-auto"
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-xl">📚</span> Sources
              </h2>

              {citations.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No sources found for this search.
                </p>
              ) : (
                <div className="space-y-3">
                  {citations.map((citation, index) => (
                    <Citation
                      key={citation.url + citation.globalIndex}
                      title={citation.title}
                      url={citation.url}
                      number={citation.globalIndex}
                      isHighlighted={highlightedIndex === citation.globalIndex}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
