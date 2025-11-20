interface CitationProps {
  title: string;
  url: string;
  number: number;
  isHighlighted?: boolean;
}

export function Citation({ title, url, number, isHighlighted }: CitationProps) {
  let hostname = "Source";
  try {
    hostname = new URL(url).hostname;
  } catch (e) {
    // ignore invalid url
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors border ${
        isHighlighted
          ? "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800"
          : "bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750"
      }`}
    >
      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium">
        {number}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {hostname}
        </p>
      </div>
    </a>
  );
}
