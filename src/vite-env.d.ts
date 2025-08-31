/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STACK_PROJECT_ID: string
  readonly VITE_STACK_PUBLISHABLE_CLIENT_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}