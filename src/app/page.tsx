"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QueryForm } from "~/components/QueryForm";
import { ResponseDisplay } from "~/components/ResponseDisplay";
import { SearchResultsSidebar } from "~/components/SearchResultsSidebar";
import { TopBar } from "~/components/TopBar";

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: Array<{ title: string; url: string }>;
}

export default function Home() {
  const [hasSearched, setHasSearched] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [highlightedCitation, setHighlightedCitation] = useState<number | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentCitations, setCurrentCitations] = useState<Array<{ title: string; url: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSubmit = async (searchQuery: string) => {
    setHasSearched(true);
    setIsLoading(true);
    setError(null);
    setCurrentCitations([]);

    const newMessagesWithPlaceholder: Message[] = [
      ...messages,
      { role: "user", content: searchQuery },
      { role: "assistant", content: "" }
    ];
    setMessages(newMessagesWithPlaceholder);

    // Helper to get messages for API call without the empty assistant placeholder
    const messagesForApi = newMessagesWithPlaceholder.slice(0, -1);

    try {
      const res = await fetch("/api/search/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesForApi }),
      });

      if (!res.ok) throw new Error(res.statusText);
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.citations && data.citations.length > 0) {
                 setCurrentCitations(prev => {
                  const newCitations = [...prev, ...data.citations];
                  // Deduplicate citations
                  const uniqueCitations = Array.from(
                    new Map(newCitations.map((item) => [item.url, item])).values()
                  );
                  return uniqueCitations;
                });
              }

              setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg.role === "assistant") {
                   return [
                     ...prev.slice(0, -1),
                     { 
                       ...lastMsg, 
                       content: lastMsg.content + (data.text || ""),
                       citations: data.citations ? [...(lastMsg.citations || []), ...data.citations] : lastMsg.citations // Accumulate citations? Or just rely on currentCitations for sidebar
                     }
                   ];
                }
                return prev;
              });

            } catch (e) {
              console.error("Error parsing chunk", e);
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stream response");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white relative selection:bg-blue-100 dark:selection:bg-blue-900 flex overflow-hidden">
      {/* Sidebar (Fixed) */}
      <SearchResultsSidebar
        citations={currentCitations}
        highlightedIndex={highlightedCitation}
        isOpen={isSidebarOpen && hasSearched}
      />

      {/* Main Content Wrapper */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out h-full relative ${
          isSidebarOpen && hasSearched ? "mr-0 md:mr-80" : ""
        }`}
      >
        {/* Top Bar */}
        {hasSearched && (
          <TopBar 
            isSidebarOpen={isSidebarOpen} 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          />
        )}

        {/* Scrollable Content Area */}
        <div 
          ref={scrollRef}
          className={`flex-1 overflow-y-auto px-4 ${hasSearched ? "pt-20" : "pt-8"}`}
        >
          <div className="container mx-auto max-w-4xl min-h-full flex flex-col pb-32">
            
            {/* Header / Title */}
            <AnimatePresence>
              {!hasSearched && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
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
                className="flex-1 space-y-8"
              >
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-800 dark:text-red-200">
                      Error: {error}
                    </p>
                  </div>
                )}

                {messages.map((msg, index) => {
                  if (msg.role === "user") {
                    return (
                      <div key={index} className="flex justify-end mb-8">
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl px-5 py-3 max-w-[75%] text-left leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                    );
                  }
                  
                  const isLast = index === messages.length - 1;
                  const showResearching = isLoading && isLast;
                  const showFinished = !isLoading && isLast; // Or always show finished for past messages? Let's stick to the latest one or just completed ones.
                                                             // Requirement: "once done, it should say 'Finished researching'"
                  
                  return (
                    <div key={index} className="relative">
                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
                         {isLoading && isLast ? (
                            <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">
                              Researching...
                            </span>
                         ) : (
                            <span>Finished researching</span>
                         )}
                      </div>
                      
                      <ResponseDisplay
                        response={msg.content}
                        onHoverCitation={setHighlightedCitation}
                      />
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Area - Always at bottom of flex column */}
        <div className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-transparent">
          <div className="container mx-auto max-w-4xl">
             <QueryForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
