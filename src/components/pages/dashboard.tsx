import { useReadContract } from "wagmi";
import contracts from "@/contracts/contracts";
import { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { ModelsByOwner } from "./models-by-owner";
import type { Address } from "viem";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";

import { hederaTestnetChain } from "@/lib/hederaChain";
import { sleep } from "@/lib/utils";
// import { formatNumber } from "@/lib/utils";

export interface proposalCountEventProps {
  id: bigint;
  description: string;
  deadline: bigint;
}

export function Dashboard() {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const address = activeAccount?.address;

  console.log({
    "Active Wallet": activeWallet,
    "Active Account": activeAccount,
    Address: address,
  });

  const chain = activeWallet?.getChain();
  console.log("Chain: ", chain);

  // Auto-switch to Hedera testnet when wallet is connected but on wrong network
  useEffect(() => {
    const switchToHederaTestnet = async () => {
      if (chain?.id !== hederaTestnetChain.id && activeWallet && address) {
        try {
          await sleep(3000);
          await activeWallet.switchChain(hederaTestnetChain);
          const isChain = activeWallet?.getChain();
          console.log("Is Chain: ", isChain);
          if (isChain?.id === hederaTestnetChain.id) {
            toast.success(`Switched to Hedera Testnet (${isChain.id})`, {
              className: "toast-success",
            });
          }
          if (isChain?.id !== hederaTestnetChain.id) {
            toast.error(`Failed to switch chain`, {
              className: "toast-error",
            });
          }
        } catch (error) {
          toast.error(`Failed to switch chain: ${error}`, {
            className: "toast-error",
          });
        }
      }
    };

    switchToHederaTestnet();
  }, [chain, address, activeWallet]);

  const { data: docCountPerAddr } = useReadContract({
    ...contracts.ModelRegistry,
    functionName: "_modelCountPerAddr",
    chainId: hederaTestnetChain.id,
    args: [address as Address],
  });

  const { data: user } = useReadContract({
    ...contracts.ModelRegistry,
    functionName: "isUser",
    chainId: hederaTestnetChain.id,
    args: [address as `0x${string}`],
  });

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
            Total Models
          </h3>
          <div className="text-base sm:text-2xl font-bold">
            {docCountPerAddr || "0"}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-2 md:p-6 bg-gradient-to-tl from-muted to-background">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
            Total Sold
          </h3>
          <div className="text-base sm:text-2xl font-bold">0</div>
        </div>
        <div className="rounded-lg border bg-card p-2 md:p-6 bg-gradient-to-tl from-muted to-background">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
            Archived Models
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
        <h3 className="text-xl font-semibold mb-4">My Models</h3>
        <ModelsByOwner
          limit={5}
          heightClass="h-[43.5vh] sm:h-[42.5vh] md:h-[31.5vh] lg:h-[49.5vh]"
        />
      </div>
    </div>
  );
}
