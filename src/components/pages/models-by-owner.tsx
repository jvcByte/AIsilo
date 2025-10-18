import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { useModels } from "@/hooks/use-models";
import { formatRelativeTime, truncateAddress } from "@/lib/utils";
import { CHAIN_IDS } from "@/lib/chain-utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Unplug, Hash, Clock, User, Copy, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-hot-toast";

interface ModelsByOwnerProps {
  limit?: number;
  heightClass?: string;
}

export function ModelsByOwner({ limit = 10, heightClass }: ModelsByOwnerProps) {
  const { models, isLoading, error, hasContractData } = useModels();
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();

  // Get the chain from the active wallet
  const chain = activeWallet?.getChain();

  const navigate = useNavigate();
  const [displayLimit, setDisplayLimit] = useState(limit);

  // Copy CID to clipboard
  // Sort models by upload time (most recent first)
  const sortedModels = useMemo(() => {
    if (!models.length) return models;

    return [...models].sort((a, b) => {
      const timeA = BigInt(a.uploadTime);
      const timeB = BigInt(b.uploadTime);
      return timeB > timeA ? 1 : timeB < timeA ? -1 : 0; // Descending order (most recent first)
    });
  }, [models]);

  const copyToClipboard = async (cid: string) => {
    try {
      await navigator.clipboard.writeText(cid);
      toast.success("CID copied to clipboard!");
    } catch (err) {
      toast.error(`Failed to copy CID ${err}`);
    }
  };

  // Navigate to model details (could be same as download for now)
  const handleViewDetails = (cid: string) => {
    navigate({
      to: "/download-model",
      search: { cid },
    });
  };

  // Empty state for no wallet connection
  if (!activeAccount?.address) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-muted to-background">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Unplug className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
          Connect Your Wallet
        </h3>
        <p className="text-muted-foreground text-center text-sm sm:text-base max-w-xs sm:max-w-sm">
          Connect your wallet to view your uploaded models.
        </p>
      </div>
    );
  }

  // Wrong network state
  if (chain?.id !== CHAIN_IDS.HEDERATESTNET) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-muted to-background">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
          <Hash className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
          Wrong Network
        </h3>
        <p className="text-muted-foreground text-center text-sm sm:text-base max-w-xs sm:max-w-sm">
          Please switch to the Hedera Testnet network to view your models.
        </p>
        <Badge variant="outline" className="mt-3 text-xs">
          Current: {chain?.id ? `Chain ${chain.id}` : "Unknown"}
        </Badge>
      </div>
    );
  }

  // Loading state - show while waiting for contract data
  if (isLoading || !hasContractData) {
    return (
      <div className="space-y-3 sm:space-y-4 bg-gradient-to-br from-muted to-background">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2 sm:space-y-3">
                  <div className="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-2 sm:h-3 bg-muted rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-5 sm:h-6 bg-muted rounded-full w-16 sm:w-20"></div>
                    <div className="h-5 sm:h-6 bg-muted rounded-full w-12 sm:w-16"></div>
                  </div>
                </div>
                <div className="h-2 sm:h-3 bg-muted rounded w-16 sm:w-20 flex-shrink-0"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-muted to-background">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-red-600 text-center">
          Failed to Load Models
        </h3>
        <p className="text-muted-foreground text-center text-sm sm:text-base max-w-xs sm:max-w-sm mb-4">
          Unable to fetch your models. Please check your connection and try
          refreshing.
        </p>
        <Badge variant="destructive" className="text-xs">
          Error loading models
        </Badge>
      </div>
    );
  }

  // No models state - only show after loading is complete and we have definitive data
  if (!isLoading && !error && hasContractData && models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-muted to-background">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
          No Model Found
        </h3>
        <p className="text-muted-foreground text-center text-sm sm:text-base max-w-xs sm:max-w-sm">
          You haven't uploaded any model yet. Upload your first model to see it
          here.
        </p>
      </div>
    );
  }

  const displayModels = sortedModels.slice(0, displayLimit);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 ">
        <div>
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              <span className="animate-pulse">Loading models...</span>
            ) : (
              <>
                {models.length} model{models.length !== 1 ? "s" : ""} uploaded
              </>
            )}
          </p>
        </div>
        {models.length > displayLimit && !isLoading && (
          <Badge variant="outline" className="text-xs">
            Showing {displayLimit} of {models.length}
          </Badge>
        )}
      </div>

      {/* Models List */}
      <ScrollArea
        className={`${heightClass ?? "h-[60vh] sm:h-[calc(90vh-13rem)]"} w-full rounded-md`}
      >
        <div className="space-y-3 sm:space-y-4 pr-2 sm:pr-4">
          {displayModels.map((model, index) => (
            <Card
              key={model.id}
              className="group hover:shadow-md transition-all duration-200 bg-gradient-to-br from-muted to-background"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Model Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                    </div>
                  </div>

                  {/* Model Content */}
                  <div className="flex-1 min-w-0">
                    {/* Model Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <h3 className="font-semibold text-sm sm:text-base truncate">
                        {model.fileName}
                      </h3>
                      <Badge variant="outline" className="text-xs w-fit">
                        #{index + 1}
                      </Badge>
                    </div>

                    {/* Model Details */}
                    <div className="space-y-2 mb-4">
                      {/* CID */}
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                          IPFS CID:
                        </span>
                        <code className="bg-muted px-2 py-1 rounded text-xs font-mono break-all flex-1">
                          {model.cid.length >
                          (window.innerWidth < 640 ? 15 : 25)
                            ? `${model.cid.slice(0, window.innerWidth < 640 ? 15 : 25)}...`
                            : model.cid}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(model.cid);
                          }}
                          className="h-6 w-6 p-0 hover:bg-muted"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Model ID and Uploader */}
                      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-medium text-xs">
                            Model ID:
                          </span>
                          <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                            {model.modelId.length > 15
                              ? `${model.modelId.slice(0, 15)}...`
                              : model.modelId}
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground font-medium text-xs">
                            Uploader:
                          </span>
                          <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                            {truncateAddress(
                              model.uploader,
                              window.innerWidth < 640 ? 4 : 6,
                            )}
                          </code>
                        </div>
                      </div>
                    </div>

                    {/* Upload Time and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>
                          Uploaded{" "}
                          {formatRelativeTime(BigInt(model.uploadTime))}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(model.cid);
                          }}
                          className="text-xs cursor-pointer"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show More Indicator */}
        {models.length > displayLimit && (
          <Card
            className="bg-muted/50 mt-4 cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() =>
              setDisplayLimit((prev) => Math.min(prev + limit, models.length))
            }
          >
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                Showing {displayLimit} of {models.length} models
              </p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {models.length - displayLimit} more models available
                </Badge>
                <Button variant="ghost" size="sm" className="text-xs">
                  Load More
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show Less Option */}
        {displayLimit > limit && (
          <Card className="bg-muted/50 mt-2">
            <CardContent className="p-3 sm:p-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDisplayLimit(limit)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Show Less
              </Button>
            </CardContent>
          </Card>
        )}
      </ScrollArea>
    </div>
  );
}
