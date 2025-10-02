import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useReadContract, usePublicClient } from 'wagmi';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import contracts from '@/contracts/contracts';
import { encryptFile } from '@/lib/encryption';
import { uploadToIPFS, generateEmergencyQR } from '@/lib/ipfs';
import { toast } from 'react-hot-toast';
import { DOCUMENT_REGISTRY_EVENTS } from '@/contracts/events';

export interface ContractDocument {
  documentHash: string;
  cId: string;
  uploader: string;
  uploadTime: bigint;
  archived: boolean;
}

export interface DocumentUploadedLog {
  user?: `0x${string}`;
  docHash?: `0x${string}`;
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
  file: File;
  accessLevel: 'private' | 'shared' | 'emergency';
  emergencyCode?: string;
  expirationTime?: number;
  allowedUsers?: string[];
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
  docHash: `0x${string}`;
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
  documentHash: string;
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
  const { writeContract } = useWriteContract();
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();
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

  // Fetch events using useQuery
  const { data: events = [] } = useQuery({
    queryKey: ["document-registry-events", contracts.DocumentRegistry.address],
    queryFn: async (): Promise<DocumentRegistryEventData[]> => {
      if (!publicClient) return [];

      try {
        console.log('🔄 Fetching document registry events...');

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

        console.log('📨 Fetched events:', {
          documentUploaded: documentUploadedLogs.length,
          roleGranted: roleGrantedLogs.length,
          roleRevoked: roleRevokedLogs.length,
          roleAdminChanged: roleAdminChangedLogs.length,
        });

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
              docHash: (log.args as DocumentUploadedLog).docHash || '0x',
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
        console.error("❌ Error fetching Document Registry events:", error);
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
    documentHash: doc.documentHash,
    uploader: doc.uploader,
    uploadTime: Number(doc.uploadTime),
    archived: doc.archived,
    accessLevel: 'private' as const,
  })) || [];

  // Debug logging
  console.log("Contract documents:", contractDocuments);
  console.log("Transformed documents:", documents);
  console.log("Document count:", documentCount);
  console.log("Loading state:", isLoadingDocuments);
  console.log("Events:", events);

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
      const { file, accessLevel, emergencyCode, expirationTime, allowedUsers } = params;

      // Generate unique document ID
      const documentId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Get user's private key (in production, this would be handled securely)
      const privateKey = new Uint8Array(32); // Placeholder - in production, get from wallet

      // Encrypt the file
      const { encryptedData, metadata, hash } = await encryptFile(
        file,
        address,
        documentId,
        privateKey
      );

      // Upload to IPFS
      const ipfsResult = await uploadToIPFS(encryptedData, {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        documentId: documentId,
        walletAddress: address,
        encryptionMetadata: metadata
      });

      // Generate emergency access if needed
      let emergencyAccess: EmergencyAccess | undefined;
      if (accessLevel === 'emergency' && emergencyCode) {
        const qrCode = generateEmergencyQR(
          documentId,
          emergencyCode,
          expirationTime || Date.now() + 24 * 60 * 60 * 1000 // 24 hours default
        );

        emergencyAccess = {
          documentId,
          emergencyCode,
          qrCode,
          expirationTime: expirationTime || Date.now() + 24 * 60 * 60 * 1000,
          createdBy: address,
          createdAt: Date.now()
        };
      }

      // Upload to blockchain
      const hashBytes = new TextEncoder().encode(hash);
      const hashHex = `0x${Array.from(hashBytes).map(b => b.toString(16).padStart(2, '0')).join('')}` as `0x${string}`;

      await writeContract({
        ...contracts.DocumentRegistry,
        functionName: "uploadDocument",
        args: [hashHex, ipfsResult.cid],
      });

      // Grant access to allowed users if specified
      if (allowedUsers && allowedUsers.length > 0) {
        for (const userAddress of allowedUsers) {
          await writeContract({
            ...contracts.DocumentRegistry,
            functionName: "grantRole",
            args: [contracts.DocumentRegistry.abi.find(item => item.name === "USER_ROLE")?.outputs?.[0]?.name || "0x0", userAddress as `0x${string}`],
          });
        }
      }

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ["documents"] });
      await queryClient.invalidateQueries({ queryKey: ["document-registry-events"] });

      toast.success('Document uploaded successfully');

      return {
        documentId,
        cid: ipfsResult.cid,
        hash: hash,
        emergencyAccess
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      toast.error(`Upload failed: ${errorMessage}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected, writeContract, queryClient]);

  return {
    // State
    documents,
    events,
    documentCount: documentCount || 0,
    isLoading: isLoading || isLoadingDocuments,
    error,

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