import { useDocuments, getEventStyle, type DocumentRegistryEventData, type DocumentUploadedEventData, type RoleGrantedEventData, type RoleRevokedEventData } from "@/hooks/use-documents";
import { formatRelativeTime, truncateAddress } from "@/lib/utils";
import { useAccount, useReadContract } from "wagmi";
import contracts from "@/contracts/contracts";
import { CHAIN_IDS } from "@/lib/chain-utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ExternalLink,
  User,
  Unplug,
  ArrowRight,
  Edit,
  Clock,
  Hash,
  Search,
  X,
  Filter,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo } from "react";

// Helper function to get event icon component
function getEventIcon(eventName: string) {
  switch (eventName) {
    case "NameRegistered":
      return <User className="w-4 h-4" />;
    case "NameTransferred":
      return <ArrowRight className="w-4 h-4" />;
    case "NameUpdated":
      return <Edit className="w-4 h-4" />;
    default:
      return <Hash className="w-4 h-4" />;
  }
}

interface RecentActivityProps {
  limit?: number;
  // Optional Tailwind height classes to control the scrollable area height from parent
  heightClass?: string;
}

export function RecentActivity({ limit = 10, heightClass }: RecentActivityProps) {
  const { events, isLoading, error } = useDocuments();
  const { address, chainId } = useAccount();

  // Read role constants from contract
  const { data: userRole } = useReadContract({
    ...contracts.DocumentRegistry,
    functionName: "USER_ROLE",
    query: {
      enabled: true,
    },
  });

  const { data: defaultAdminRole } = useReadContract({
    ...contracts.DocumentRegistry,
    functionName: "DEFAULT_ADMIN_ROLE",
    query: {
      enabled: true,
    },
  });

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [displayLimit, setDisplayLimit] = useState(limit);

  // Helper function to format role display
  function formatRoleDisplay(role: string): string {
    if (userRole && role === userRole) {
      return "USER";
    }
    if (defaultAdminRole && role === defaultAdminRole) {
      return "ADMIN";
    }
    return role.length > (window.innerWidth < 640 ? 15 : 20)
      ? `${role.slice(0, window.innerWidth < 640 ? 15 : 20)}...`
      : role;
  }

  // Filter and search events
  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];

    return events.filter((event: DocumentRegistryEventData) => {
      // Event type filter
      if (eventTypeFilter !== "all" && event.eventName !== eventTypeFilter) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() === "") return true;

      const query = searchQuery.toLowerCase();

      // Search in various fields based on event type
      const searchableFields: string[] = [
        event.transactionHash,
        event.blockNumber.toString(),
      ];

      // Add event-specific fields
      if (event.eventName === "DocumentUploaded") {
        searchableFields.push(
          (event as DocumentUploadedEventData).cid,
          (event as DocumentUploadedEventData).user,
          (event as DocumentUploadedEventData).documentId,
        );
      } else if (event.eventName === "RoleGranted") {
        searchableFields.push(
          (event as RoleGrantedEventData).role,
          (event as RoleGrantedEventData).account,
          (event as RoleGrantedEventData).sender,
        );
      } else if (event.eventName === "RoleRevoked") {
        searchableFields.push(
          (event as RoleRevokedEventData).role,
          (event as RoleRevokedEventData).account,
          (event as RoleRevokedEventData).sender,
        );
      }

      const searchableText = searchableFields
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [events, searchQuery, eventTypeFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setEventTypeFilter("all");
    setDisplayLimit(limit);
  };

  // Debug logging
  console.log("RecentActivity Debug:", {
    events,
    isLoading,
    error,
    eventsLength: events?.length || 0,
    filteredEventsLength: filteredEvents?.length || 0,
  });

  // Check if any filters are active
  const hasActiveFilters = searchQuery.trim() !== "";

  // Empty state for no wallet connection
  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4 sm:px-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Unplug className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
          Connect Your Wallet
        </h3>
        <p className="text-muted-foreground text-center text-sm sm:text-base max-w-xs sm:max-w-sm">
          Connect your wallet to view recent contract activities and
          transactions.
        </p>
      </div>
    );
  }

  // Wrong network state
  if (chainId !== CHAIN_IDS.HEDERATESTNET) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4 sm:px-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
          <Hash className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
          Wrong Network
        </h3>
        <p className="text-muted-foreground text-center text-sm sm:text-base max-w-xs sm:max-w-sm">
          Please switch to the Hedera Testnet network to view recent activities.
        </p>
        <Badge variant="outline" className="mt-3 text-xs">
          Current: {chainId ? `Chain ${chainId}` : "Unknown"}
        </Badge>
      </div>
    );
  }

  // Loading state with modern skeleton
  if (isLoading) {
    return (
      <div className="space-y-3 sm:space-y-4">
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
      <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4 sm:px-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <ExternalLink className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-red-600 text-center">
          Failed to Load
        </h3>
        <p className="text-muted-foreground text-center text-sm sm:text-base max-w-xs sm:max-w-sm mb-4">
          Unable to fetch recent activities. Please check your connection and
          try refreshing the page.
        </p>
        <Badge variant="destructive" className="text-xs">
          Error
        </Badge>
      </div>
    );
  }

  // No events state - only show this if we're not loading and not in error state and events is actually an empty array (not undefined)
  if (!isLoading && !error && events !== undefined && events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4 sm:px-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
          No Recent Activity
        </h3>
        <p className="text-muted-foreground text-center text-sm sm:text-base max-w-xs sm:max-w-sm">
          No recent contract activities found. Activities will appear here
          once transactions are made.
        </p>
      </div>
    );
  }

  const displayEvents = filteredEvents.slice(0, displayLimit);

  return (
    <div className="bg-gradient-to-tl from-muted to-background">
      {/* Search and Filter Section */}
      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by transaction hash, address, or block number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Event Type Filter */}
          <div className="flex gap-2">
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Filter by type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="DocumentUploaded">Document Uploaded</SelectItem>
                <SelectItem value="RoleGranted">Role Granted</SelectItem>
                <SelectItem value="RoleRevoked">Role Revoked</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="px-3"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>
            {searchQuery && (
              <Badge variant="secondary" className="text-xs">
                Search: "
                {searchQuery.length > 20
                  ? `${searchQuery.slice(0, 20)}...`
                  : searchQuery}
                "
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Activity Counter - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className="px-2 py-1 text-xs sm:px-3 sm:text-sm"
          >
            {events.length} Total Events
          </Badge>
          {hasActiveFilters && (
            <Badge
              variant="outline"
              className="px-2 py-1 text-xs sm:px-3 sm:text-sm"
            >
              {filteredEvents.length} Filtered
            </Badge>
          )}
          {filteredEvents.length > displayLimit && (
            <Badge
              variant="outline"
              className="px-2 py-1 text-xs sm:px-3 sm:text-sm"
            >
              Showing {displayLimit} of {filteredEvents.length}
            </Badge>
          )}
        </div>
      </div>

      {/* No Results State */}
      {filteredEvents.length === 0 && hasActiveFilters && (
        <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4 sm:px-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
            No Results Found
          </h3>
          <p className="text-muted-foreground text-center text-sm sm:text-base max-w-xs sm:max-w-sm mb-4">
            No events match your current search criteria.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}

      {filteredEvents.length > 0 && (
        <ScrollArea
          className={`${heightClass ?? "h-[60vh] sm:h-[calc(90vh-13rem)]"
            } w-full rounded-md`}
        >
          <div className="space-y-3 sm:space-y-4 pr-2 sm:pr-4">
            {/* Events List */}
            <div className="grid gap-3 sm:gap-4">
              {displayEvents.map((event, index) => {
                const { color } = getEventStyle(event);
                return (
                  <Card
                    key={`${event.transactionHash}-${event.logIndex}`}
                    className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary bg-gradient-to-tl from-muted to-background"
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Event Icon - Smaller on mobile */}
                        <div className="flex-shrink-0">
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${event.eventName === "DocumentUploaded"
                              ? "from-blue-100 to-blue-200 text-blue-600"
                              : event.eventName === "RoleGranted"
                                ? "from-green-100 to-green-200 text-green-600"
                                : "from-yellow-100 to-yellow-200 text-yellow-600"
                              }`}
                          >
                            {getEventIcon(event.eventName)}
                          </div>
                        </div>

                        {/* Event Content */}
                        <div className="flex-1 min-w-0">
                          {/* Main Description */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                            <h4 className={`font-semibold text-sm ${color}`}>
                              {event.eventName === "DocumentUploaded" &&
                                "Document Uploaded"}
                              {event.eventName === "RoleGranted" &&
                                "Role Granted"}
                              {event.eventName === "RoleRevoked" &&
                                "Role Revoked"}
                            </h4>
                            <Badge variant="outline" className="text-xs w-fit">
                              #{index + 1}
                            </Badge>
                          </div>

                          {/* Event Details - Stack on mobile */}
                          <div className="space-y-2">
                            {event.eventName === "DocumentUploaded" && (
                              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                                    IPFS CID:
                                  </span>
                                  <code className="bg-muted px-2 py-1 rounded text-xs font-mono break-all">
                                    {(event as DocumentUploadedEventData).cid.length > (window.innerWidth < 640 ? 15 : 20)
                                      ? `${(event as DocumentUploadedEventData).cid.slice(0, window.innerWidth < 640 ? 15 : 20)}...`
                                      : (event as DocumentUploadedEventData).cid}
                                  </code>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                                    User:
                                  </span>
                                  <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                                    {truncateAddress(
                                      (event as DocumentUploadedEventData).user,
                                      window.innerWidth < 640 ? 4 : 6,
                                    )}
                                  </code>
                                </div>
                              </div>
                            )}

                            {event.eventName === "RoleGranted" && (() => {
                              const roleEvent = event as RoleGrantedEventData;
                              const isSelfGrant = roleEvent.sender === roleEvent.account;

                              return (
                                <div className="flex flex-col gap-4 md:flex-row md:items-center text-sm">
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                                      Role:
                                    </span>
                                    <code className="bg-muted px-2 py-1 rounded text-xs font-mono break-all">
                                      {formatRoleDisplay(roleEvent.role)}
                                    </code>
                                  </div>

                                  {!isSelfGrant ? (
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                                          From:
                                        </span>
                                        <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                                          {truncateAddress(roleEvent.sender, window.innerWidth < 640 ? 4 : 6)}
                                        </code>
                                      </div>
                                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground hidden sm:block" />
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                                          To:
                                        </span>
                                        <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                                          {truncateAddress(roleEvent.account, window.innerWidth < 640 ? 4 : 6)}
                                        </code>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                                        Account:
                                      </span>
                                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                                        {truncateAddress(roleEvent.account, window.innerWidth < 640 ? 4 : 6)}
                                      </code>
                                      <Badge variant="outline" className="text-xs hidden md:inline-flex">Self-granted</Badge>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}

                            {event.eventName === "RoleRevoked" && (
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                                    Role:
                                  </span>
                                  <code className="bg-muted px-2 py-1 rounded text-xs font-mono break-all">
                                    {formatRoleDisplay((event as RoleRevokedEventData).role)}
                                  </code>
                                </div>
                                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                                      Revoked by:
                                    </span>
                                    <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                                      {truncateAddress(
                                        (event as RoleRevokedEventData).sender,
                                        window.innerWidth < 640 ? 4 : 6,
                                      )}
                                    </code>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                                      Account:
                                    </span>
                                    <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                                      {truncateAddress(
                                        (event as RoleRevokedEventData).account,
                                        window.innerWidth < 640 ? 4 : 6,
                                      )}
                                    </code>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Transaction Details - Stack on mobile */}
                            <div className="flex flex-row items-center justify-between pt-3 border-t border-border/50 gap-4">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span className="hidden sm:inline">
                                    Block #
                                  </span>
                                  <span className="sm:hidden">#</span>
                                  {event.blockNumber.toString()}
                                </div>
                                <a
                                  href={`https://hashscan.io/testnet/transaction/${event.transactionHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 hover:text-primary transition-colors w-fit"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span className="hidden sm:inline">
                                    View on Hedera Testnet
                                  </span>
                                  <span className="sm:hidden">Hedera Testnet</span>
                                </a>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatRelativeTime(event.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Show More Indicator */}
            {filteredEvents.length > displayLimit && (
              <Card
                className="bg-muted/50 mt-4 cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() =>
                  setDisplayLimit((prev) =>
                    Math.min(prev + limit, filteredEvents.length),
                  )
                }
              >
                <CardContent className="p-3 sm:p-4 text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    Showing {displayLimit} of {filteredEvents.length} filtered
                    events
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {filteredEvents.length - displayLimit} more events
                      available
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Load More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Show Less Option when displayLimit exceeds initial limit */}
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
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
