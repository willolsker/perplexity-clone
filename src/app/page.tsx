"use client";

import { useState } from "react";
import { api } from "~/utils/api";
import { QueryForm } from "~/components/QueryForm";
import { ResponseDisplay } from "~/components/ResponseDisplay";

export default function Home() {
  const [query, setQuery] = useState<string>("");

  const searchMutation = api.search.query.useMutation();

  const handleSubmit = (searchQuery: string) => {
    setQuery(searchQuery);
    searchMutation.mutate({ query: searchQuery });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Perplexity Clone
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ask anything and get AI-powered answers with citations
          </p>
        </div>

        <QueryForm
          onSubmit={handleSubmit}
          isLoading={searchMutation.isPending}
        />

        {searchMutation.isError && (
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">
              Error: {searchMutation.error?.message ?? "Something went wrong"}
            </p>
          </div>
        )}

        {searchMutation.isPending && (
          <div className="mt-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Searching and generating response...
            </span>
          </div>
        )}

        {searchMutation.isSuccess && searchMutation.data && (
          <ResponseDisplay
            response={searchMutation.data.response}
            citations={searchMutation.data.citations}
          />
        )}
      </div>
    </main>
  );
}

