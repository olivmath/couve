import { StackClientApp } from "@stackframe/stack";

// Debug: Verificar variáveis de ambiente
console.log('Stack Auth Config:', {
  projectId: import.meta.env.VITE_STACK_PROJECT_ID,
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY ? 'SET' : 'NOT SET',
  isDev: import.meta.env.DEV
});

// Configuração do Stack Auth para o cliente
export const stackClientApp = new StackClientApp({
  projectId: import.meta.env.VITE_STACK_PROJECT_ID,
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY,
  tokenStore: "cookie",
});
