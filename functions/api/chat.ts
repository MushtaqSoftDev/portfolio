import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RetrievalQAChain } from "langchain/chains";

export const onRequestPost: PagesFunction<{ GOOGLE_API_KEY: string }> = async (context) => {

  // CORS preflight handling FIRST
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  try {
    if (!context.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is missing");
    }

    const { question } = await context.request.json();

    const knowledgeBase = `
      I am Mushtaq, a Full-Stack developer based in Barcelona, Spain.

      Skills:
        - React, Three.js, Tailwind
        - Node.js, LangChain, Flask, Laravel, SpringBoot
        - Pytorch, OpenAI APIs
        - MongoDB, Docker, Git

      Projects:
      - Laravel Streaming Platform
      - React 3D Portfolio Website
      - AI chatbot with RAG
      - NextJS Event Management App
`;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 600,
      chunkOverlap: 100,
    });

    const docs = await splitter.createDocuments([knowledgeBase]);

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: context.env.GOOGLE_API_KEY,
    });

    const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

    const model = new ChatGoogleGenerativeAI({
      apiKey: context.env.GOOGLE_API_KEY,
      modelName: "gemini-1.5-flash",
      temperature: 0.2,
    });

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
    const result = await chain.call({ query: question });

    return new Response(JSON.stringify({ answer: result.text }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return new Response(
      JSON.stringify({ error: "LLM failed to respond" }),
      { status: 500 }
    );
  }
};





