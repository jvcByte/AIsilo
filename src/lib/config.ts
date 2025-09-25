import { QueryClient } from "@tanstack/react-query";

// Centralized app metadata for template reuse
export const APP_NAME = import.meta.env.VITE_APP_NAME ?? "W3DT";
export const APP_DESCRIPTION =
  import.meta.env.VITE_APP_DESCRIPTION ??
  "A starter template for building authenticated Web3 dapps (wagmi + viem + ConnectKit + TanStack Router).";
export const APP_URL = import.meta.env.VITE_APP_URL ?? "https://example.com";
export const APP_ICON = import.meta.env.VITE_APP_ICON ?? "/logo.png"; // Path under /public

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

export { queryClient };
