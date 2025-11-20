import React from "react";

interface ResponseDisplayProps {
  response: string;
  onHoverCitation?: (index: number | null) => void;
}

export function ResponseDisplay({ response, onHoverCitation }: ResponseDisplayProps) {
  if (!response) return null;

  // Split by citation pattern [n]
  const parts = response.split(/(\[\d+\])/g);

  return (
    <div className="mt-8 space-y-6 pb-32">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
          {parts.map((part, i) => {
            const match = part.match(/^\[(\d+)\]$/);
            if (match) {
              const index = parseInt(match[1]) - 1;
              return (
                <span
                  key={i}
                  className="inline-flex items-center justify-center ml-1 w-5 h-5 text-xs font-medium text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/50 rounded-full cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors align-top select-none"
                  onMouseEnter={() => onHoverCitation?.(index)}
                  onMouseLeave={() => onHoverCitation?.(null)}
                >
                  {match[1]}
                </span>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </div>
      </div>
    </div>
  );
}
