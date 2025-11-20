import React from "react";
import { Source } from "./ResponseDisplay";

interface InlineCitationProps {
  href: string;
  sources: Source[];
  onHoverCitation?: (index: number | null) => void;
}

const getHostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Source";
  }
};

export function InlineCitation({
  href,
  sources,
  onHoverCitation,
}: InlineCitationProps) {
  const indicesString = href.replace("#citation-", "");
  const indices = indicesString
    .split(",")
    .map((s) => parseInt(s.trim()))
    .filter((n) => !isNaN(n));

  if (indices.length === 0) return null;

  const firstIndex = indices[0];
  const source = sources.find((s) => s.globalIndex === firstIndex);
  const hostname = source ? getHostname(source.url) : "Source";

  const count = indices.length;
  const label = count > 1 ? `${hostname} + ${count - 1}` : hostname;

  return (
    <span
      className="inline-flex items-center gap-1 ml-1 px-2 py-0.5 text-xs font-medium text-gray-800 bg-gray-100 dark:text-gray-200 dark:bg-gray-800 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors align-baseline select-none"
      onMouseEnter={() => onHoverCitation?.(firstIndex)}
      onMouseLeave={() => onHoverCitation?.(null)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {label}
    </span>
  );
}
