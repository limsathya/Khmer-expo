/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_ENCRYPTION_KEY?: string;
  readonly VITE_SESSION_TIMEOUT_SECONDS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}