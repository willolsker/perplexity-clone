import { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const searchRouter = createTRPCRouter({
  query: publicProcedure
    .input(
      z.object({
        query: z.string().min(1, "Query cannot be empty"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const result = await genAI.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: `${input.query}\n\nPlease answer the query and cite your sources inline using the format [1], [2], etc.`,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        const candidate = result.candidates?.[0];
        if (!candidate) {
          throw new Error("No candidates returned from Gemini API");
        }

        const text = candidate.content?.parts?.[0]?.text ?? "";

        // Extract citations from the response
        const citations: Array<{ title: string; url: string }> = [];

        // Check if the response has grounding metadata
        if (candidate.groundingMetadata?.groundingChunks) {
          for (const chunk of candidate.groundingMetadata.groundingChunks) {
            if (chunk.web) {
              citations.push({
                title: chunk.web.title || "Source",
                url: chunk.web.uri || "",
              });
            }
          }
        }

        // Remove duplicate citations
        const uniqueCitations = Array.from(
          new Map(citations.map((item) => [item.url, item])).values()
        );

        return {
          response: text,
          citations: uniqueCitations,
        };
      } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error(
          error instanceof Error ? error.message : "Failed to generate response"
        );
      }
    }),
});
