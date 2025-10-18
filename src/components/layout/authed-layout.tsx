import { Outlet } from "@tanstack/react-router";
import { SearchProvider } from "@/context/search-provider";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SkipToMain } from "@/components/skip-to-main";
import { AuthenticatedHeader } from "@/components/layout/authenticated-header";
import { AuthGuard } from "@/components/auth/auth-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle, UserPlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useReadContract } from "wagmi";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { thirdwebClient } from "@/lib/thirdweb/thirdweb-client"; // Import your thirdweb client
import contracts from "@/contracts/contracts";
import { CHAIN_IDS } from "@/lib/chain-utils";
import { defineChain } from "thirdweb/chains";

type AuthenticatedLayoutProps = {
  children?: React.ReactNode;
};

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;

  // Use thirdweb's useSendTransaction instead of wagmi's useWriteContract
  const { mutate: sendTransaction, isPending: isRegistering } =
    useSendTransaction();

  const {
    data: user,
    refetch: refetchUser,
    error: userError,
    isError: isUserError,
    isLoading: isCheckingUser,
    isFetched: isUserFetched,
  } = useReadContract({
    ...contracts.ModelRegistry,
    functionName: "isUser",
    chainId: CHAIN_IDS.HEDERATESTNET,
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address, // Only fetch when address exists
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  });

  const handleRegister = async () => {
    if (!activeAccount) {
      toast.error("Please connect your wallet first", {
        className: "toast-error",
      });
      return;
    }

    try {
      // Define the chain
      const hederaTestnet = defineChain(CHAIN_IDS.HEDERATESTNET);

      // Prepare the contract call using thirdweb
      const transaction = prepareContractCall({
        contract: {
          address: contracts.ModelRegistry.address,
          abi: contracts.ModelRegistry.abi,
          chain: hederaTestnet,
          client: thirdwebClient,
        },
        method: "register",
        params: [],
      });

      // Send transaction using thirdweb
      sendTransaction(transaction, {
        onSuccess: (result) => {
          console.log("Transaction successful:", result);
          toast.success("Registration successful!", {
            className: "toast-success",
          });
          setShowRegisterModal(false);
          // Refetch user status after a short delay
          setTimeout(() => {
            refetchUser();
          }, 2000);
        },
        onError: (error) => {
          console.error("Registration failed:", error);
          toast.error(`Registration failed: ${error.message}`, {
            className: "toast-error",
          });
        },
      });
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(
        `Registration failed: ${error instanceof Error ? error.message : String(error)}`,
        {
          className: "toast-error",
        },
      );
    }
  };

  // Handle user status changes - only update modal state when data is fetched
  useEffect(() => {
    if (!address) {
      console.log("No address connected");
      setShowRegisterModal(false);
      return;
    }

    if (isCheckingUser) {
      console.log("Still checking user status...");
      return;
    }

    if (isUserFetched) {
      console.log("User status fetched:", user);
      if (user === false) {
        console.log("User not registered, showing modal");
        setShowRegisterModal(true);
      } else if (user === true) {
        console.log("User is registered, hiding modal");
        setShowRegisterModal(false);
      } else {
        console.log("Unexpected user status:", user);
      }
    }

    if (isUserError) {
      console.error("Error checking user status:", userError);
      toast.error("Failed to check registration status. Please try again.", {
        className: "toast-error",
      });
    }
  }, [address, user, isCheckingUser, isUserFetched, isUserError, userError]);

  // // Debug logging
  // console.log("AuthenticatedLayout Debug:");
  // console.log("Active account:", activeAccount);
  // console.log("Address:", address);
  // console.log("User status:", user);
  // console.log("Is checking user:", isCheckingUser);
  // console.log("Is user fetched:", isUserFetched);
  // console.log("User error:", userError);
  // console.log("Is user error:", isUserError);
  // console.log("Contract address:", contracts.ModelRegistry.address);
  // console.log("Show register modal:", showRegisterModal);

  // Show loading state while checking user status
  if (address && isCheckingUser && !isUserFetched) {
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
              <div className="flex w-full items-center justify-center min-h-[90vh] p-4">
                <Card className="w-full max-w-md bg-gradient-to-br from-muted to-background">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">
                      Checking registration status...
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

  // Show registration modal
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
              <div className="flex w-full items-center justify-center min-h-[90vh] p-4 bg-gradient-to-tl from-muted to-background">
                <Card className="w-full max-w-md bg-gradient-to-br from-muted to-background">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserPlus className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl">
                      Welcome to AIsilo!
                    </CardTitle>
                    <CardDescription className="text-base">
                      You need to register to ensure valid user.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="font-medium mb-2">What you'll get:</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Access to AI model marketplace
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Upload & manage your AI models
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Monitization of AI models
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Secure encrypted Model storage
                        </li>
                      </ul>
                    </div>
                    <Button
                      onClick={handleRegister}
                      disabled={isRegistering}
                      className="w-full cursor-pointer"
                      size="lg"
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Register Now"
                      )}
                    </Button>
                    {isRegistering && (
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

  // Main authenticated layout
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
