import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import contracts from "@/contracts/contracts";
import { useDocuments } from "@/hooks/use-documents";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { FilesByOwner } from "./files-by-owner";

// import { formatNumber } from "@/lib/utils";

export interface proposalCountEventProps {
  id: bigint;
  description: string;
  deadline: bigint;
}

export function Dashboard() {
  const { documents, isLoading, error } = useDocuments();
  console.log("Documents: ", documents);
  const { address } = useAccount();
  console.log("Loading: ", isLoading);
  console.log("Error: ", error);

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { data: documentCount } = useReadContract({
    ...contracts.DocumentRegistry,
    functionName: "getDocumentCount",
  });

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

  console.log("Contract Owner: ", documentCount);

  useEffect(() => {

    if (user === false) {
      setShowRegisterModal(true);
    } else if (user === true) {
      setShowRegisterModal(false);
    }
  }, [user]);

  if (showRegisterModal) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-tl from-muted to-background">
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
    );
  }

  return (
    <div className="flex flex-col gap-2 md:gap-6 p-4 max-w-[1500px] mx-auto bg-gradient-to-tl from-muted to-background">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        {user && (
          <Badge variant="outline" className="text-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Registered User
          </Badge>
        )}
      </div>
      <div className="grid gap-2 grid-cols-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-2 md:p-6 bg-gradient-to-tl from-muted to-background">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
            Total Files
          </h3>
          <div className="text-base sm:text-2xl font-bold">{documentCount || "0"}</div>
        </div>
        <div className="rounded-lg border bg-card p-2 md:p-6 bg-gradient-to-tl from-muted to-background">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
            Protected Files
          </h3>
          <div className="text-base sm:text-2xl font-bold">{documentCount || "0"}</div>
        </div>
        <div className="rounded-lg border bg-card p-2 md:p-6 bg-gradient-to-tl from-muted to-background">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
            Archived Files
          </h3>
          <div className="text-base sm:text-2xl font-bold">0</div>
        </div>
        <div className="rounded-lg border bg-card p-2 md:p-6 bg-gradient-to-tl from-muted to-background">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
            Access Granted
          </h3>
          <div className="text-base md:text-2xl font-bold">0</div>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-6 bg-gradient-to-t from-muted to-background">
        <h3 className="text-xl font-semibold mb-4">My Documents</h3>
        <FilesByOwner limit={5} heightClass="h-[43.5vh] sm:h-[42.5vh] md:h-[31.5vh] lg:h-[49.5vh]" />
      </div>
    </div>
  );
}