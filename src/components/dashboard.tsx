import { useReadContract } from "wagmi";
import contracts from "@/contracts/contracts";
import { useNameServiceEvents } from "@/hooks/use-ens-events";
import { RecentActivity } from "@/components/RecentActivity";
import { truncateAddress } from "@/lib/utils";
// import { formatNumber } from "@/lib/utils";

export interface proposalCountEventProps {
  id: bigint;
  description: string;
  deadline: bigint;
}

export function Dashboard() {
  const { data: events, isLoading, error } = useNameServiceEvents();
  console.log("Events: ", events);
  console.log("Loading: ", isLoading);
  console.log("Error: ", error);
  const { data: contractOwner } = useReadContract({
    ...contracts.ENS,
    functionName: "contractOwner",
  });

  console.log("Contract Owner: ", contractOwner);
  return (
    <div className="flex flex-col gap-2 md:gap-6 p-4 max-w-[1500px] mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="grid gap-2 grid-cols-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-2 md:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
            Total Proposals
          </h3>
          <div className="text-base sm:text-2xl font-bold">{truncateAddress(contractOwner) || "0"}</div>
        </div>
        <div className="rounded-lg border bg-card p-2 md:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
            Active Votes
          </h3>
          <div className="text-base sm:text-2xl font-bold">3</div>
        </div>
        <div className="rounded-lg border bg-card p-2 md:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
            Your Votes
          </h3>
          <div className="text-base sm:text-2xl font-bold">8</div>
        </div>
        <div className="rounded-lg border bg-card p-2 md:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
            Voting Power
          </h3>
          <div className="text-base md:text-2xl font-bold">156</div>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <RecentActivity limit={5} heightClass="h-[43.5vh] sm:h-[42.5vh] md:h-[31.5vh] lg:h-[49.5vh]" />
      </div>
    </div>
  );
}
