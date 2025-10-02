import { Outlet } from "@tanstack/react-router";
import { SearchProvider } from "@/context/search-provider";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SkipToMain } from "@/components/skip-to-main";
import { AuthenticatedHeader } from "@/components/layout/authenticated-header";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import contracts from "@/contracts/contracts";

type AuthenticatedLayoutProps = {
  children?: React.ReactNode;
};


export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { address } = useAccount();


  const { data: user, refetch: refetchUser } = useReadContract({
    ...contracts.DocumentRegistry,
    functionName: "isUser",
    args: [address as `0x${string}`],
  });

  const { writeContract: registerUser, isPending: isRegistering, data: txHash } = useWriteContract();

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleRegister = async () => {
    try {
      registerUser({
        ...contracts.DocumentRegistry,
        functionName: "register",
      });
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(`Registration failed: ${error}`, {
        className: "toast-error",
      });
    }
  };

  // Handle successful registration
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Registration successful!", {
        className: "toast-success",
      });
      setShowRegisterModal(false);
      // Refetch user status
      refetchUser();
    }
  }, [isConfirmed, refetchUser]);

  useEffect(() => {
    if (user === false) {
      setShowRegisterModal(true);
    } else if (user === true) {
      setShowRegisterModal(false);
    }
  }, [user]);

  if (showRegisterModal) {
    return (
      <AuthGuard>
        <SearchProvider>
          <SidebarProvider defaultOpen={true}>
            <SkipToMain />
            <AppSidebar />
            <main className="flex w-full flex-col bg-gradient-to-tl from-muted to-background">
              <div className="flex items-center sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <SidebarTrigger className="mr-5" />
                <AuthenticatedHeader className="mx-auto" />
              </div>
              <div className="flex w-full items-center justify-center min-h-screen p-4 bg-gradient-to-tl from-muted to-background">
                <Card className="w-full max-w-md bg-gradient-to-br from-muted to-background">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserPlus className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl">Welcome to Fileit!</CardTitle>
                    <CardDescription className="text-base">
                      You need to register to access your secure document storage
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="font-medium mb-2">What you'll get:</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Secure encrypted file storage
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          IPFS decentralized storage
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Emergency access features
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Role-based access control
                        </li>
                      </ul>
                    </div>
                    <Button
                      onClick={handleRegister}
                      disabled={isRegistering || isConfirming}
                      className="w-full cursor-pointer"
                      size="lg"
                    >
                      {isRegistering || isConfirming ? "Processing..." : "Register Now"}
                    </Button>
                    {isConfirming && (
                      <p className="text-xs text-blue-600 text-center font-medium">
                        Waiting for transaction confirmation...
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground text-center">
                      Registration is free and only takes a few seconds
                    </p>
                  </CardContent>
                </Card>
              </div>
            </main>
          </SidebarProvider>
        </SearchProvider>
      </AuthGuard>
    );
  }
  return (
    <AuthGuard>
      <SearchProvider>
        <SidebarProvider defaultOpen={true}>
          <SkipToMain />
          <AppSidebar />
          <main className="flex w-full flex-col bg-gradient-to-tl from-muted to-background">
            <div className="flex items-center sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <SidebarTrigger className="mr-5" />
              <AuthenticatedHeader className="mx-auto" />
            </div>
            <div>{children ?? <Outlet />}</div>
          </main>
        </SidebarProvider>
      </SearchProvider>
    </AuthGuard>
  );
}

