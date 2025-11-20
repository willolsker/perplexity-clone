import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const contents = messages.map((msg: Message) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Append instruction to the last user message
    const lastMessage = contents[contents.length - 1];
    if (lastMessage.role === "user") {
        lastMessage.parts[0].text += "\n\nPlease answer the query and cite your sources inline using the format [1], [2], etc.";
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await genAI.models.generateContentStream({
            model: "gemini-3-pro-preview",
            contents: contents,
            config: {
              tools: [{ googleSearch: {} }],
            },
          });

          const encoder = new TextEncoder();

          for await (const chunk of result) {
            const candidate = chunk.candidates?.[0];
            const text = candidate?.content?.parts?.[0]?.text || "";
            
            // Extract citations if available
            let citations: Array<{ title: string; url: string }> = [];
            if (candidate?.groundingMetadata?.groundingChunks) {
              for (const chunk of candidate.groundingMetadata.groundingChunks) {
                if (chunk.web) {
                  citations.push({
                    title: chunk.web.title || "Source",
                    url: chunk.web.uri || "",
                  });
                }
              }
            }

            const data = JSON.stringify({
              text,
              citations
            });

            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Failed to generate response",
      { status: 500 }
    );
  }
}
