interface CitationProps {
  title: string;
  url: string;
  index: number;
}

export function Citation({ title, url, index }: CitationProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
    >
      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium">
        {index + 1}
      </span>
      <span className="truncate max-w-xs">{title}</span>
    </a>
  );
}

