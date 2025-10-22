import { useAccount } from "wagmi";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { createContext, useContext, useMemo } from "react";
import { queryClient } from "@/lib/config";

import type { RouterContext } from "@/lib/types";

const AuthContext = createContext<RouterContext | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isConnected: isWagmiConnected, address: wagmiAddress } = useAccount();
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();

  // Check if connected via thirdweb (in-app wallet) or wagmi (external wallets)
  const isThirdwebConnected = !!activeAccount?.address && !!activeWallet?.id;
  const isAuthenticated = isWagmiConnected || isThirdwebConnected;
  const address = (wagmiAddress || activeAccount?.address) as
    | `0x${string}`
    | undefined;

  const contextValue = useMemo(
    () => ({
      queryClient,
      auth: {
        isAuthenticated,
        address,
      },
    }),
    [isAuthenticated, address],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
