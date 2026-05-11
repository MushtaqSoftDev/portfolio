/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RAG_API_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
