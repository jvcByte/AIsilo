import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Check if connected via thirdweb (social auth) or wagmi (external wallets)
  const isConnected = !!activeAccount;

  useEffect(() => {
    if (!isConnected && !activeWallet) {
      setIsRedirecting(true);
      // Small delay to show loading state before redirect
      const timer = setTimeout(() => {
        router.navigate({
          to: "/",
          replace: true,
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isConnected, activeWallet, router]);

  // Show loading state while connecting or redirecting
  if (isRedirecting || !isConnected) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-tl from-muted to-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            {activeWallet ? "Authenticating..." : "Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
