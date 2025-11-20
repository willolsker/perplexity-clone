import React from "react";

interface InlineCitationProps {
  href: string;
  children: React.ReactNode;
  onHoverCitation?: (index: number | null) => void;
}

export function InlineCitation({
  href,
  children,
  onHoverCitation,
}: InlineCitationProps) {
  const indicesString = href.replace("citation:", "");
  const indices = indicesString.split(",").map(Number);
  const firstIndex = indices[0];

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
      {children}
    </span>
  );
}
