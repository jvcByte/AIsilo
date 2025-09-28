import { QueryClient } from "@tanstack/react-query";

export const APP_NAME = import.meta.env.VITE_APP_NAME ?? "File It";
export const APP_DESCRIPTION = import.meta.env.VITE_APP_DESCRIPTION ?? "File It DApp";
export const APP_ICON = import.meta.env.VITE_APP_ICON ?? "/logo.png"; // Path under /public
export const APP_URL = import.meta.env.VITE_APP_MODE == "development" ?
  "http://localhost:5173/" : import.meta.env.VITE_APP_URL;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

export { queryClient };
