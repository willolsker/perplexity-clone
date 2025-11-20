import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { InlineCitation } from "./InlineCitation";

export interface Source {
  globalIndex: number;
  title: string;
  url: string;
  summary?: string;
}

interface ResponseDisplayProps {
  response: string;
  sources?: Source[];
  onHoverCitation?: (index: number | null) => void;
}

export function ResponseDisplay({
  response,
  sources = [],
  onHoverCitation,
}: ResponseDisplayProps) {
  if (!response) return null;

  // Process the response to handle citations as links
  // Format: [<[1, 2]>] -> [citation](#citation-1,2)
  const processedResponse = response.replace(
    /\[<\[([\d,\s]+)\]>\]/g,
    (match, ids) => {
      const indices = ids
        .split(",")
        .map((s: string) => s.trim())
        .filter((s: string) => !isNaN(parseInt(s)));

      if (indices.length === 0) return "";
      return ` [citation](#citation-${indices.join(",")}) `;
    }
  );

  return (
    <div className="mt-8 space-y-6">
      <div className="prose prose-slate dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ node, href, children, ...props }) => {
              if (href?.startsWith("#citation-")) {
                return (
                  <InlineCitation
                    href={href}
                    sources={sources}
                    onHoverCitation={onHoverCitation}
                  />
                );
              }
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  {...props}
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {processedResponse}
        </ReactMarkdown>
      </div>
    </div>
  );
}
