import { QueryClient } from "@tanstack/react-query";

export const APP_NAME = import.meta.env.VITE_APP_NAME ?? "File It";
export const APP_DESCRIPTION = import.meta.env.VITE_APP_DESCRIPTION ?? "File It DApp";
export const APP_ICON = import.meta.env.VITE_APP_ICON ?? "/logo.png"; // Path under /public
// Helper function to determine if we're in development
const isDevelopment = () => {
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }
  return import.meta.env.DEV || import.meta.env.VITE_APP_MODE === "development";
};

// Get the appropriate APP_URL based on environment
export const APP_URL = isDevelopment()
  ? "http://localhost:5173/"
  : (import.meta.env.VITE_APP_URL || (typeof window !== 'undefined' ? window.location.origin + '/' : 'https://fileit01.vercel.app/'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
      staleTime: 1_000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1, // Only retry once
      retryDelay: 1000 // 1 second between retries
    },
    mutations: {
      retry: 1
    }
  }
});

export { queryClient };
