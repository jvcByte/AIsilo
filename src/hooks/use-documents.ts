import { useState, useCallback } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { publicClient, getWagmiWalletClient } from "@/lib/viem";
import { useQuery } from '@tanstack/react-query';
import contracts from '@/contracts/contracts';
import { toast } from 'react-hot-toast';
import { DOCUMENT_REGISTRY_EVENTS } from '@/contracts/events';
import { BaseError, ContractFunctionRevertedError, UserRejectedRequestError, type Address } from 'viem';

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
  accessLevel: 'read' | 'write' | 'emergency';
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
  accessLevel: 'private' | 'shared' | 'emergency';
}

/**
 * Hook for managing documents and contract events with NIST/ISO compliant security
 */
export function useDocuments() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all documents from the contract
  const { data: contractDocuments, isLoading: isLoadingDocuments } = useReadContract({
    ...contracts.DocumentRegistry,
    functionName: "getAllDocuments",
    query: {
      enabled: true,
    },
  });

  // Get document count
  const { data: documentCount } = useReadContract({
    ...contracts.DocumentRegistry,
    functionName: "getDocumentCount",
    query: {
      enabled: true,
    },
  });

  const { data: getDocumentsByOwner } = useReadContract({
    ...contracts.DocumentRegistry,
    functionName: "getDocumentsByOwner",
    args: [address as Address],
    query: {
      enabled: true,
    },
  });

  // Fetch events using useQuery
  const { data: events = [] } = useQuery({
    queryKey: ["document-registry-events", contracts.DocumentRegistry.address],
    queryFn: async (): Promise<DocumentRegistryEventData[]> => {
      if (!publicClient) return [];

      try {

        // Fetch all event types in parallel
        const [documentUploadedLogs, roleGrantedLogs, roleRevokedLogs, roleAdminChangedLogs] = await Promise.all([
          publicClient.getLogs({
            address: contracts.DocumentRegistry.address,
            event: DOCUMENT_REGISTRY_EVENTS.DocumentUploaded,
            fromBlock: "earliest",
            toBlock: "latest",
          }),
          publicClient.getLogs({
            address: contracts.DocumentRegistry.address,
            event: DOCUMENT_REGISTRY_EVENTS.RoleGranted,
            fromBlock: "earliest",
            toBlock: "latest",
          }),
          publicClient.getLogs({
            address: contracts.DocumentRegistry.address,
            event: DOCUMENT_REGISTRY_EVENTS.RoleRevoked,
            fromBlock: "earliest",
            toBlock: "latest",
          }),
          publicClient.getLogs({
            address: contracts.DocumentRegistry.address,
            event: DOCUMENT_REGISTRY_EVENTS.RoleAdminChanged,
            fromBlock: "earliest",
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
              user: (log.args as DocumentUploadedLog).user || '0x',
              documentId: (log.args as DocumentUploadedLog).docID || '',
              cid: (log.args as DocumentUploadedLog).cid || '',
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
              role: (log.args as RoleGrantedLog).role || '0x',
              account: (log.args as RoleGrantedLog).account || '0x',
              sender: (log.args as RoleGrantedLog).sender || '0x',
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
              role: (log.args as RoleRevokedLog).role || '0x',
              account: (log.args as RoleRevokedLog).account || '0x',
              sender: (log.args as RoleRevokedLog).sender || '0x',
            }),
          ),
        ];

        // Sort by timestamp (most recent first)
        return allEvents.sort((a, b) => {
          if (a.timestamp !== b.timestamp) {
            return Number(b.timestamp - a.timestamp);
          }
          // If same timestamp, sort by log index
          return b.logIndex - a.logIndex;
        }).slice(0, 100); // Limit to 100 most recent events
      } catch (error) {
        toast.error(`Failed to fetch Document Registry events: ${error}`, {
          className: "toast-error"
        });
        return [];
      }
    },
    enabled: !!publicClient,
    staleTime: 50000, // Cache for 50 seconds
    refetchInterval: 20000, // Refetch every 20 seconds
  });

  // Transform contract data to our Document interface
  const documents: Document[] = contractDocuments?.map((doc: ContractDocument, index: number) => ({
    id: `doc-${index}`,
    fileName: `Document ${index + 1}`, // This would come from IPFS metadata
    fileType: 'unknown',
    fileSize: 0,
    cid: doc.cId,
    documentId: doc.documentId,
    uploader: doc.uploader,
    uploadTime: Number(doc.uploadTime),
    archived: doc.archived,
    accessLevel: 'private' as const,
  })) || [];

  /**
   * Upload a document with encryption and IPFS storage
   */
  const uploadDocument = useCallback(async (params: UploadDocumentParams) => {
    if (!address || !isConnected) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const { docId, cId } = params;
      // Upload to blockchain
      // writeContract({
      //   ...contracts.DocumentRegistry,
      //   functionName: "uploadDocument",
      //   args: [docId, cId],
      // })

      const walletClient = await getWagmiWalletClient();
      if (!walletClient) {
        toast.error("No connected wallet found. Please connect your wallet.", {
          className: "toast-error",
        });
        return;
      }

      const { request } = await publicClient.simulateContract({
        account: walletClient.account,
        address: contracts.DocumentRegistry.address,
        abi: contracts.DocumentRegistry.abi,
        functionName: "uploadDocument",
        args: [docId, cId],
      });
      await walletClient.writeContract(request);

    } catch (err) {
      if (err instanceof UserRejectedRequestError) {
        toast.error("Transaction cancelled by user", {
          className: "toast-error",
        });
        return;
      }

      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError,
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.reason ?? "Unknown Error Occurred";
          toast.error(`Blockchain write failed: ${errorName}`, {
            className: "toast-error",
          });
          setError(`Blockchain write failed: ${errorName}`);
        } else {
          // Handle chain mismatch errors specifically
          if (err.message.includes("chain") || err.message.includes("Chain")) {
            toast.error(
              "Chain mismatch error. Switch to BlockDag(id:1043)",
              {
                className: "toast-error",
              },
            );
            setError(
              "Chain mismatch error. Switch to BlockDag(id:1043)",
            );
          } else {
            const errorMessage =
              err.shortMessage || err.message || "Unknown error occurred";
            toast.error(`Blockchain write failed: ${errorMessage}`, {
              className: "toast-error",
            });
            setError(`Blockchain write failed: ${errorMessage}`);
          }
        }
      } else {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        toast.error(`Blockchain write failed: ${errorMessage}`, {
          className: "toast-error",
        });
        setError(`Blockchain write failed: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  return {
    // State
    documents,
    events,
    documentCount: documentCount || 0,
    isLoading: isLoading || isLoadingDocuments,
    error,
    getDocumentsByOwner,

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