import { useDocuments, type ContractDocument } from "@/hooks/use-documents";
import { formatRelativeTime, truncateAddress } from "@/lib/utils";
import { useAccount } from "wagmi";
import { CHAIN_IDS } from "@/lib/chain-utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Unplug, Hash, Clock, User, Copy, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

interface FilesByOwnerProps {
  limit?: number;
  heightClass?: string;
}

export function FilesByOwner({ limit = 10, heightClass }: FilesByOwnerProps) {
  const { getDocumentsByOwner, isLoading, error } = useDocuments();
  const { address, chainId } = useAccount();
  const navigate = useNavigate();
  const [displayLimit, setDisplayLimit] = useState(limit);

  console.log("getDocumentsByOwner: ", getDocumentsByOwner);

  // Transform contract documents to our format
  const documents = useMemo(() => {
    if (!getDocumentsByOwner) return [];

    return getDocumentsByOwner.map((doc: ContractDocument, index: number) => ({
      id: `doc-${index}`,
      fileName: `Document ${index + 1}`,
      fileType: "unknown",
      fileSize: 0,
      cid: doc.cId,
      documentId: doc.documentId,
      uploader: doc.uploader,
      uploadTime: Number(doc.uploadTime),
      archived: doc.archived,
      accessLevel: "private" as const,
    }));
  }, [getDocumentsByOwner]);

  // Copy CID to clipboard
  // Sort documents by upload time (most recent first)
  const sortedDocuments = useMemo(() => {
    if (!documents.length) return documents;

    return [...documents].sort((a, b) => {
      const timeA = BigInt(a.uploadTime);
      const timeB = BigInt(b.uploadTime);
      return timeB > timeA ? 1 : timeB < timeA ? -1 : 0; // Descending order (most recent first)
    });
  }, [documents]);
  const copyToClipboard = async (cid: string) => {
    try {
      await navigator.clipboard.writeText(cid);
      toast.success("CID copied to clipboard!");
    } catch (err) {
      toast.error(`Failed to copy CID ${err}`);
    }
  };

  // Navigate to document details (could be same as download for now)
  const handleViewDetails = (cid: string) => {
    navigate({
      to: "/download-file",
      search: { cid },
    });
  };

  // Empty state for no wallet connection
  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-muted to-background">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Unplug className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
          Connect Your Wallet
        </h3>
        <p className="text-muted-foreground text-center text-sm sm:text-base max-w-xs sm:max-w-sm">
          Connect your wallet to view your uploaded documents.
        </p>
      </div>
    );
  }

  // Wrong network state
  if (chainId !== CHAIN_IDS.HEDERATESTNET) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-muted to-background">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
          <Hash className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
          Wrong Network
        </h3>
        <p className="text-muted-foreground text-center text-sm sm:text-base max-w-xs sm:max-w-sm">
          Please switch to the Hedera Testnet network to view your documents.
        </p>
        <Badge variant="outline" className="mt-3 text-xs">
          Current: {chainId ? `Chain ${chainId}` : "Unknown"}
        </Badge>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
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
          Failed to Load Documents
        </h3>
        <p className="text-muted-foreground text-center text-sm sm:text-base max-w-xs sm:max-w-sm mb-4">
          Unable to fetch your documents. Please check your connection and try
          refreshing.
        </p>
        <Badge variant="destructive" className="text-xs">
          Error loading documents
        </Badge>
      </div>
    );
  }

  // No documents state
  if (!isLoading && !error && documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-muted to-background">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
          No Documents Found
        </h3>
        <p className="text-muted-foreground text-center text-sm sm:text-base max-w-xs sm:max-w-sm">
          You haven't uploaded any documents yet. Upload your first document to
          see it here.
        </p>
      </div>
    );
  }

  const displayDocuments = sortedDocuments.slice(0, displayLimit);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 ">
        <div>
          <p className="text-sm text-muted-foreground">
            {documents.length} document{documents.length > 1 ? "s" : ""}{" "}
            uploaded
          </p>
        </div>
        {documents.length > displayLimit && (
          <Badge variant="outline" className="text-xs">
            Showing {displayLimit} of {documents.length}
          </Badge>
        )}
      </div>

      {/* Documents List */}
      <ScrollArea
        className={`${heightClass ?? "h-[60vh] sm:h-[calc(90vh-13rem)]"} w-full rounded-md`}
      >
        <div className="space-y-3 sm:space-y-4 pr-2 sm:pr-4">
          {displayDocuments.map((document, index) => (
            <Card
              key={document.id}
              className="group hover:shadow-md transition-all duration-200 bg-gradient-to-br from-muted to-background"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Document Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                    </div>
                  </div>

                  {/* Document Content */}
                  <div className="flex-1 min-w-0">
                    {/* Document Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <h3 className="font-semibold text-sm sm:text-base truncate">
                        {document.fileName}
                      </h3>
                      <Badge variant="outline" className="text-xs w-fit">
                        #{index + 1}
                      </Badge>
                    </div>

                    {/* Document Details */}
                    <div className="space-y-2 mb-4">
                      {/* CID */}
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                          IPFS CID:
                        </span>
                        <code className="bg-muted px-2 py-1 rounded text-xs font-mono break-all flex-1">
                          {document.cid.length >
                          (window.innerWidth < 640 ? 15 : 25)
                            ? `${document.cid.slice(0, window.innerWidth < 640 ? 15 : 25)}...`
                            : document.cid}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(document.cid);
                          }}
                          className="h-6 w-6 p-0 hover:bg-muted"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Document ID and Uploader */}
                      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-medium text-xs">
                            Document ID:
                          </span>
                          <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                            {document.documentId.length > 15
                              ? `${document.documentId.slice(0, 15)}...`
                              : document.documentId}
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground font-medium text-xs">
                            Uploader:
                          </span>
                          <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                            {truncateAddress(
                              document.uploader,
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
                          {formatRelativeTime(BigInt(document.uploadTime))}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(document.cid);
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
        {documents.length > displayLimit && (
          <Card
            className="bg-muted/50 mt-4 cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() =>
              setDisplayLimit((prev) =>
                Math.min(prev + limit, documents.length),
              )
            }
          >
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                Showing {displayLimit} of {documents.length} documents
              </p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {documents.length - displayLimit} more documents available
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
