import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { useReadContract } from "wagmi";
import { publicClient } from "@/lib/viem";
import contracts from "@/contracts/contracts";
import { toast } from "react-hot-toast";
import type { Address } from "viem";
import { DOCUMENT_REGISTRY_EVENTS } from "@/contracts/events";
import { CHAIN_IDS } from "@/lib/chain-utils";
import { prepareContractCall } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { thirdwebClient } from "@/lib/thirdweb/thirdweb-client";

export interface ContractDocument {
  documentId: string;
  cId: string;
  uploader: `0x${string}`;
  uploadTime: bigint;
  archived: boolean;
}

export interface DocumentUploadedLog {
  user?: `0x${string}`;
  docID?: string;
  cid?: string;
}

export interface RoleGrantedLog {
  role?: `0x${string}`;
  account?: `0x${string}`;
  sender?: `0x${string}`;
}

export interface RoleRevokedLog {
  role?: `0x${string}`;
  account?: `0x${string}`;
  sender?: `0x${string}`;
}

export interface DocumentAccess {
  documentId: string;
  userAddress: string;
  accessLevel: "read" | "write" | "emergency";
  grantedBy: string;
  grantedAt: number;
  expiresAt?: number;
}

export interface EmergencyAccess {
  documentId: string;
  emergencyCode: string;
  qrCode: string;
  expirationTime: number;
  createdBy: string;
  createdAt: number;
}

export interface UploadDocumentParams {
  docId: string;
  cId: string;
}

export interface DocumentRegistryEventBase {
  eventName: string;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
  logIndex: number;
  timestamp: bigint;
}

export interface DocumentUploadedEventData extends DocumentRegistryEventBase {
  eventName: "DocumentUploaded";
  user: `0x${string}`;
  documentId: string;
  cid: string;
}

export interface RoleGrantedEventData extends DocumentRegistryEventBase {
  eventName: "RoleGranted";
  role: `0x${string}`;
  account: `0x${string}`;
  sender: `0x${string}`;
}

export interface RoleRevokedEventData extends DocumentRegistryEventBase {
  eventName: "RoleRevoked";
  role: `0x${string}`;
  account: `0x${string}`;
  sender: `0x${string}`;
}

export type DocumentRegistryEventData =
  | DocumentUploadedEventData
  | RoleGrantedEventData
  | RoleRevokedEventData;

// Custom Document interface for our application data
export interface Document {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  cid: string;
  documentId: string;
  uploader: string;
  uploadTime: number;
  archived: boolean;
  accessLevel: "private" | "shared" | "emergency";
}

/**
 * Hook for managing documents and contract events with NIST/ISO compliant security
 */
export function useDocuments() {
  const activeAccount = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  const address = activeAccount?.address;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get document count for the current address
  const { data: documentCount } = useReadContract({
    ...contracts.DocumentRegistry,
    functionName: "_docCountPerAddr",
    chainId: CHAIN_IDS.HEDERATESTNET,
    args: address ? [address as Address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // If document count is 0, user has no documents - skip the documents query

  // Get documents belonging to the current user (only if they have documents)
  const {
    data: getDocumentsByOwner,
    isLoading: isLoadingUserDocuments,
    // isError: isDocumentsError,
    error: documentsError,
  } = useReadContract({
    ...contracts.DocumentRegistry,
    functionName: "getDocumentsByOwner",
    chainId: CHAIN_IDS.HEDERATESTNET,
    args: address ? [address as Address] : undefined,
    query: {
      enabled:
        !!address &&
        documentCount !== undefined &&
        (documentCount as bigint) > 0n, // Only if has documents
      refetchInterval: 10000,
      staleTime: 5000,
    },
  });

  // Fetch events using useQuery - only when wallet is connected
  const {
    data: events = [],
    isLoading: isLoadingEvents,
    error: eventsError,
  } = useQuery({
    queryKey: [
      "document-registry-events",
      contracts.DocumentRegistry.address,
      address,
    ],
    queryFn: async (): Promise<DocumentRegistryEventData[]> => {
      if (!publicClient || !address) return [];

      try {
        // Get current block number
        const currentBlock = await publicClient.getBlockNumber();

        // Calculate blocks for approximately 6 days (to stay under 7-day limit)
        // Hedera produces ~1 block every 2 seconds, so 6 days = ~259,200 blocks
        const BLOCKS_PER_6_DAYS = 259_200n;
        const fromBlock =
          currentBlock > BLOCKS_PER_6_DAYS
            ? currentBlock - BLOCKS_PER_6_DAYS
            : 0n;

        // Fetch all event types in parallel
        const [
          documentUploadedLogs,
          roleGrantedLogs,
          roleRevokedLogs,
          roleAdminChangedLogs,
        ] = await Promise.all([
          publicClient.getLogs({
            address: contracts.DocumentRegistry.address,
            event: DOCUMENT_REGISTRY_EVENTS.DocumentUploaded,
            fromBlock: fromBlock,
            toBlock: "latest",
          }),
          publicClient.getLogs({
            address: contracts.DocumentRegistry.address,
            event: DOCUMENT_REGISTRY_EVENTS.RoleGranted,
            fromBlock: fromBlock,
            toBlock: "latest",
          }),
          publicClient.getLogs({
            address: contracts.DocumentRegistry.address,
            event: DOCUMENT_REGISTRY_EVENTS.RoleRevoked,
            fromBlock: fromBlock,
            toBlock: "latest",
          }),
          publicClient.getLogs({
            address: contracts.DocumentRegistry.address,
            event: DOCUMENT_REGISTRY_EVENTS.RoleAdminChanged,
            fromBlock: fromBlock,
            toBlock: "latest",
          }),
        ]);

        // Get unique block numbers for batch fetching timestamps
        const allLogs = [
          ...documentUploadedLogs,
          ...roleGrantedLogs,
          ...roleRevokedLogs,
          ...roleAdminChangedLogs,
        ];
        const uniqueBlockNumbers = [
          ...new Set(allLogs.map((log) => log.blockNumber)),
        ];

        // Batch fetch all block timestamps
        const blocks = await Promise.all(
          uniqueBlockNumbers.map((blockNumber) =>
            publicClient.getBlock({ blockNumber }),
          ),
        );

        // Create a map of block number to timestamp
        const blockTimestamps = new Map<bigint, bigint>();
        blocks.forEach((block) => {
          blockTimestamps.set(block.number!, block.timestamp);
        });

        // Transform and combine all events with timestamps
        const allEvents: DocumentRegistryEventData[] = [
          // Document Uploaded Events
          ...documentUploadedLogs.map(
            (log): DocumentUploadedEventData => ({
              eventName: "DocumentUploaded",
              blockNumber: log.blockNumber,
              transactionHash: log.transactionHash,
              logIndex: log.logIndex,
              timestamp: blockTimestamps.get(log.blockNumber) || 0n,
              user: (log.args as DocumentUploadedLog).user || "0x",
              documentId: (log.args as DocumentUploadedLog).docID || "",
              cid: (log.args as DocumentUploadedLog).cid || "",
            }),
          ),

          // Role Granted Events
          ...roleGrantedLogs.map(
            (log): RoleGrantedEventData => ({
              eventName: "RoleGranted",
              blockNumber: log.blockNumber,
              transactionHash: log.transactionHash,
              logIndex: log.logIndex,
              timestamp: blockTimestamps.get(log.blockNumber) || 0n,
              role: (log.args as RoleGrantedLog).role || "0x",
              account: (log.args as RoleGrantedLog).account || "0x",
              sender: (log.args as RoleGrantedLog).sender || "0x",
            }),
          ),

          // Role Revoked Events
          ...roleRevokedLogs.map(
            (log): RoleRevokedEventData => ({
              eventName: "RoleRevoked",
              blockNumber: log.blockNumber,
              transactionHash: log.transactionHash,
              logIndex: log.logIndex,
              timestamp: blockTimestamps.get(log.blockNumber) || 0n,
              role: (log.args as RoleRevokedLog).role || "0x",
              account: (log.args as RoleRevokedLog).account || "0x",
              sender: (log.args as RoleRevokedLog).sender || "0x",
            }),
          ),
        ];

        // Sort by timestamp (most recent first)
        return allEvents
          .sort((a, b) => {
            if (a.timestamp !== b.timestamp) {
              return Number(b.timestamp - a.timestamp);
            }
            // If same timestamp, sort by log index
            return b.logIndex - a.logIndex;
          })
          .slice(0, 100); // Limit to 100 most recent events
      } catch (error) {
        console.error("Failed to fetch Document Registry events:", error);
        return [];
      }
    },
    enabled: !!address && !!publicClient, // Only run when wallet is connected
    staleTime: 50000, // Cache for 50 seconds
    refetchInterval: 20000, // Refetch every 20 seconds
  });

  // Fetch IPFS metadata for a document (memoized for performance)
  const fetchIPFSMetadata = useCallback(
    async (cid: string): Promise<string> => {
      try {
        const url = `https://api.pinata.cloud/v3/files/public?cid=${cid}`;
        const options = {
          method: "GET",
          headers: {
            Authorization: import.meta.env.VITE_PINATA_AUTHORIZATION,
          },
        };

        const response = await fetch(url, options);

        if (!response.ok) {
          console.warn(
            `Failed to fetch IPFS metadata for CID ${cid}: ${response.status}`,
          );
          return `Document`; // Fallback name
        }

        const result = await response.json();

        if (!result.data?.files || result.data.files.length === 0) {
          console.log("No files found in IPFS metadata for CID", cid);
          return `Document`; // Fallback name
        }

        return result.data.files[0].name || `Document`;
      } catch (error) {
        console.error(`Error fetching IPFS metadata for CID ${cid}:`, error);
        return `Document`; // Fallback name
      }
    },
    [],
  );

  // Handle documents based on count - moved after queries are defined
  const processedDocuments = useMemo(() => {
    const count = documentCount as bigint | undefined;
    if (count === 0n || count === undefined) return []; // No documents or still loading
    // If count > 0, return the actual documents (could be undefined if still loading)
    return getDocumentsByOwner;
  }, [documentCount, getDocumentsByOwner]);

  // Add debug logs
  // console.log("Address:", address);
  // console.log("Document count:", documentCount);
  // console.log("Raw getDocumentsByOwner:", getDocumentsByOwner);
  // console.log("Processed documents:", processedDocuments);
  // console.log("isLoadingUserDocuments:", isLoadingUserDocuments);
  // console.log("isDocumentsError:", isDocumentsError);
  // console.log("documentsError:", documentsError);

  // Transform user documents to our Document interface with real filenames from IPFS
  const documents: Document[] = useMemo(() => {
    if (!processedDocuments || !Array.isArray(processedDocuments)) {
      console.log("No documents or not an array:", processedDocuments);
      return [];
    }

    console.log("Processing documents:", processedDocuments.length);

    return processedDocuments.map((doc: ContractDocument, index: number) => ({
      id: `doc-${index}`,
      fileName: `Document ${index + 1}`, // This will be updated with real name from IPFS
      fileType: "unknown",
      fileSize: 0,
      cid: doc.cId,
      documentId: doc.documentId,
      uploader: doc.uploader,
      uploadTime: Number(doc.uploadTime),
      archived: doc.archived,
      accessLevel: "private" as const,
    }));
  }, [processedDocuments]);

  // Update data validation to focus on user documents
  const hasUserData = processedDocuments !== undefined;

  // Fetch real filenames from IPFS metadata
  const [documentNames, setDocumentNames] = useState<Map<string, string>>(
    new Map(),
  );

  useMemo(() => {
    if (!processedDocuments || !Array.isArray(processedDocuments)) return;

    const fetchAllNames = async () => {
      const namePromises = processedDocuments.map(
        async (doc: ContractDocument) => {
          const name = await fetchIPFSMetadata(doc.cId);
          return { cid: doc.cId, name };
        },
      );

      try {
        const results = await Promise.allSettled(namePromises);
        const nameMap = new Map<string, string>();

        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            nameMap.set(processedDocuments[index].cId, result.value.name);
          } else {
            nameMap.set(processedDocuments[index].cId, `Document ${index + 1}`);
          }
        });

        setDocumentNames(nameMap);
      } catch (error) {
        console.error("Error fetching document names:", error);
      }
    };

    fetchAllNames();
  }, [processedDocuments, fetchIPFSMetadata]);

  // Final documents with real names from IPFS
  const finalDocuments: Document[] = useMemo(() => {
    if (!documents.length) return [];

    return documents.map((doc) => ({
      ...doc,
      fileName: documentNames.get(doc.cid) || doc.fileName,
    }));
  }, [documents, documentNames]);

  /**
   * Upload a document with encryption and IPFS storage
   */
  const uploadDocument = useCallback(
    async (params: UploadDocumentParams) => {
      if (!activeAccount) {
        toast.error("Please connect your wallet first", {
          className: "toast-error",
        });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { docId, cId } = params;

        console.log(
          "============================================\n useDocuments uploading at chainId: ",
          CHAIN_IDS.HEDERATESTNET,
          "\n============================================",
        );

        // Define the chain
        const hederaTestnet = defineChain(CHAIN_IDS.HEDERATESTNET);

        // Prepare the contract call using thirdweb
        const transaction = prepareContractCall({
          contract: {
            address: contracts.DocumentRegistry.address,
            abi: contracts.DocumentRegistry.abi,
            chain: hederaTestnet,
            client: thirdwebClient,
          },
          method: "uploadDocument",
          params: [docId, cId],
        });

        // Send transaction using thirdweb
        sendTransaction(transaction, {
          onSuccess: (result) => {
            console.log("Transaction successful:", result);
            toast.success("Document registered on blockchain!", {
              className: "toast-success",
            });
          },
          onError: (error) => {
            console.error("Upload failed:", error);
            toast.error(`Upload failed: ${error.message}`, {
              className: "toast-error",
            });
          },
        });

        console.log(
          "============================================\n useDocuments Upload Document Function Called ",
          "\n============================================",
        );
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error(
          `Upload failed: ${error instanceof Error ? error.message : String(error)}`,
          {
            className: "toast-error",
          },
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeAccount, sendTransaction],
  );

  return {
    // State
    documents: finalDocuments,
    events,
    documentCount: documentCount || 0,
    isLoading: isLoading || isLoadingUserDocuments || isLoadingEvents,
    error:
      error ||
      (eventsError ? String(eventsError) : null) ||
      (documentsError ? String(documentsError) : null),
    getDocumentsByOwner,
    hasContractData: hasUserData,

    // Actions
    uploadDocument,
  };
}

// Helper function to get human-readable event descriptions
export function getEventDescription(event: DocumentRegistryEventData): string {
  switch (event.eventName) {
    case "DocumentUploaded":
      return `Document uploaded: ${event.cid.substring(0, 10)}...`;
    case "RoleGranted":
      return `Role granted to ${event.account.substring(0, 6)}...${event.account.substring(38)}`;
    case "RoleRevoked":
      return `Role revoked from ${event.account.substring(0, 6)}...${event.account.substring(38)}`;
    default:
      return "Unknown event";
  }
}

// Helper function to get event icons/colors
export function getEventStyle(event: DocumentRegistryEventData): {
  icon: string;
  color: string;
} {
  switch (event.eventName) {
    case "DocumentUploaded":
      return { icon: "📄", color: "text-blue-600" };
    case "RoleGranted":
      return { icon: "✅", color: "text-green-600" };
    case "RoleRevoked":
      return { icon: "❌", color: "text-red-600" };
    default:
      return { icon: "❓", color: "text-gray-600" };
  }
}
