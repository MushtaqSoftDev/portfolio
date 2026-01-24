import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// Fix: New export path for MemoryVectorStore
import { MemoryVectorStore } from "langchain/vectorstores/memory"; 
// Fix: New export path for RetrievalQAChain
import { RetrievalQAChain } from "langchain/chains"; 

export const onRequestPost: PagesFunction<{ GOOGLE_API_KEY: string }> = async (context) => {
  try {
    const { question } = await context.request.json() as { question: string };

    const aboutMe = `I am a Full-Stack developer with experience in GenAI & LLM integration based in Barcelona Spain. Skills: React, Node.js, LangChain.js, Docker, MongoDB, PyTorch...`;
    
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 600, chunkOverlap: 100 });
    const docs = await splitter.createDocuments([aboutMe]);

    const embeddings = new GoogleGenerativeAIEmbeddings({ 
      apiKey: context.env.GOOGLE_API_KEY 
    });
    
    // Create the store
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
        "Access-Control-Allow-Origin": "*" 
      }
    });

  } catch (error: any) {
    console.error("Worker Error:", error);
    return new Response(JSON.stringify({ error: "I'm having trouble accessing my memory right now." }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};




