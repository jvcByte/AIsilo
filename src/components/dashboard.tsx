import { useReadContract, useAccount } from "wagmi";
import contracts from "@/contracts/contracts";
import { useDocuments } from "@/hooks/use-documents";
import { RecentActivity } from "@/components/RecentActivity";
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

  const { data: documentCount } = useReadContract({
    ...contracts.DocumentRegistry,
    functionName: "getDocumentCount",
  });

  const {data: user } = useReadContract({
    ...contracts.DocumentRegistry,
    functionName: "isUser",
    args: [address as `0x${string}`],
  });
  console.log("User: ", user);

  console.log("Contract Owner: ", documentCount);
  return (
    <div className="flex flex-col gap-2 md:gap-6 p-4 max-w-[1500px] mx-auto bg-gradient-to-tl from-muted to-background">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
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
          <div className="text-base sm:text-2xl font-bold">0</div>
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
      <div className="rounded-lg border bg-card p-6 bg-gradient-to-tl from-muted to-background">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <RecentActivity limit={5} heightClass="h-[43.5vh] sm:h-[42.5vh] md:h-[31.5vh] lg:h-[49.5vh]" />
      </div>
    </div>
  );
}
