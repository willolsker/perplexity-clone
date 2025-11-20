import { Citation } from "./Citation";

interface Citation {
  title: string;
  url: string;
}

interface ResponseDisplayProps {
  response: string;
  citations: Citation[];
}

export function ResponseDisplay({ response, citations }: ResponseDisplayProps) {
  if (!response) return null;

  return (
    <div className="mt-8 space-y-6">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
          {response}
        </div>
      </div>

      {citations.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Sources
          </h3>
          <div className="flex flex-wrap gap-3">
            {citations.map((citation, index) => (
              <Citation
                key={citation.url}
                title={citation.title}
                url={citation.url}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

