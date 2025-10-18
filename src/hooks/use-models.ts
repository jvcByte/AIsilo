import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { useReadContract } from "wagmi";
import { publicClient } from "@/lib/viem";
import contracts from "@/contracts/contracts";
import { toast } from "react-hot-toast";
import type { Address } from "viem";
import { MODEL_REGISTRY_EVENTS } from "@/contracts/events";
import { CHAIN_IDS } from "@/lib/chain-utils";
import { prepareContractCall } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { thirdwebClient } from "@/lib/thirdweb/thirdweb-client";

export interface ContractModel {
  modelId: string;
  cId: string;
  uploader: `0x${string}`;
  uploadTime: bigint;
  archived: boolean;
}

export interface ModelUploadedLog {
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

export interface ModelAccess {
  modelId: string;
  userAddress: string;
  accessLevel: "read" | "write" | "emergency";
  grantedBy: string;
  grantedAt: number;
  expiresAt?: number;
}

export interface UploadModelParams {
  modelId: string;
  cId: string;
}

export interface ModelRegistryEventBase {
  eventName: string;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
  logIndex: number;
  timestamp: bigint;
}

export interface ModelUploadedEventData extends ModelRegistryEventBase {
  eventName: "ModelUploaded";
  user: `0x${string}`;
  modelId: string;
  cid: string;
}

export interface RoleGrantedEventData extends ModelRegistryEventBase {
  eventName: "RoleGranted";
  role: `0x${string}`;
  account: `0x${string}`;
  sender: `0x${string}`;
}

export interface RoleRevokedEventData extends ModelRegistryEventBase {
  eventName: "RoleRevoked";
  role: `0x${string}`;
  account: `0x${string}`;
  sender: `0x${string}`;
}

export type ModelRegistryEventData =
  | ModelUploadedEventData
  | RoleGrantedEventData
  | RoleRevokedEventData;

// Custom Model interface for our application data
export interface Model {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  cid: string;
  modelId: string;
  uploader: string;
  uploadTime: number;
  archived: boolean;
  accessLevel: "private" | "shared" | "emergency";
}

/**
 * Hook for managing models and contract events with NIST/ISO compliant security
 */
export function useModels() {
  const activeAccount = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  const address = activeAccount?.address;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get model count for the current address
  const { data: modelCountPerAddress } = useReadContract({
    ...contracts.ModelRegistry,
    functionName: "_modelCountPerAddr",
    chainId: CHAIN_IDS.HEDERATESTNET,
    args: address ? [address as Address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // If model count is 0, user has no models - skip the models query

  // Get models belonging to the current user (only if they have models)
  const {
    data: getModelsByOwner,
    isLoading: isLoadingUserModels,
    // isError: isModelsError,
    error: modelsError,
  } = useReadContract({
    ...contracts.ModelRegistry,
    functionName: "getModelsByOwner",
    chainId: CHAIN_IDS.HEDERATESTNET,
    args: address ? [address as Address] : undefined,
    query: {
      enabled:
        !!address &&
        modelCountPerAddress !== undefined &&
        (modelCountPerAddress as bigint) > 0n, // Only if has models
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
      "model-registry-events",
      contracts.ModelRegistry.address,
      address,
    ],
    queryFn: async (): Promise<ModelRegistryEventData[]> => {
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
          ModelUploadedLogs,
          roleGrantedLogs,
          roleRevokedLogs,
          roleAdminChangedLogs,
        ] = await Promise.all([
          publicClient.getLogs({
            address: contracts.ModelRegistry.address,
            event: MODEL_REGISTRY_EVENTS.ModelUploaded,
            fromBlock: fromBlock,
            toBlock: "latest",
          }),
          publicClient.getLogs({
            address: contracts.ModelRegistry.address,
            event: MODEL_REGISTRY_EVENTS.RoleGranted,
            fromBlock: fromBlock,
            toBlock: "latest",
          }),
          publicClient.getLogs({
            address: contracts.ModelRegistry.address,
            event: MODEL_REGISTRY_EVENTS.RoleRevoked,
            fromBlock: fromBlock,
            toBlock: "latest",
          }),
          publicClient.getLogs({
            address: contracts.ModelRegistry.address,
            event: MODEL_REGISTRY_EVENTS.RoleAdminChanged,
            fromBlock: fromBlock,
            toBlock: "latest",
          }),
        ]);

        // Get unique block numbers for batch fetching timestamps
        const allLogs = [
          ...ModelUploadedLogs,
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
        const allEvents: ModelRegistryEventData[] = [
          // Model Uploaded Events
          ...ModelUploadedLogs.map(
            (log): ModelUploadedEventData => ({
              eventName: "ModelUploaded",
              blockNumber: log.blockNumber,
              transactionHash: log.transactionHash,
              logIndex: log.logIndex,
              timestamp: blockTimestamps.get(log.blockNumber) || 0n,
              user: (log.args as ModelUploadedLog).user || "0x",
              modelId: (log.args as ModelUploadedLog).docID || "",
              cid: (log.args as ModelUploadedLog).cid || "",
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
        console.error("Failed to fetch Model Registry events:", error);
        return [];
      }
    },
    enabled: !!address && !!publicClient, // Only run when wallet is connected
    staleTime: 50000, // Cache for 50 seconds
    refetchInterval: 20000, // Refetch every 20 seconds
  });

  // Fetch IPFS metadata for a model (memoized for performance)
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
          return `Model`; // Fallback name
        }

        const result = await response.json();

        if (!result.data?.files || result.data.files.length === 0) {
          console.log("No files found in IPFS metadata for CID", cid);
          return `Model`; // Fallback name
        }

        return result.data.files[0].name || `Model`;
      } catch (error) {
        console.error(`Error fetching IPFS metadata for CID ${cid}:`, error);
        return `Model`; // Fallback name
      }
    },
    [],
  );

  // Handle models based on count - moved after queries are defined
  const processedModels = useMemo(() => {
    const count = modelCountPerAddress as bigint | undefined;
    if (count === 0n || count === undefined) return []; // No models or still loading
    // If count > 0, return the actual models (could be undefined if still loading)
    return getModelsByOwner;
  }, [modelCountPerAddress, getModelsByOwner]);

  // Add debug logs
  // console.log("Address:", address);
  // console.log("Model count:", modelCount);
  // console.log("Raw getModelsByOwner:", getModelsByOwner);
  // console.log("Processed models:", processedModels);
  // console.log("isLoadingUserModels:", isLoadingUserModels);
  // console.log("isModelsError:", isModelsError);
  // console.log("modelsError:", modelsError);

  // Transform user models to our Model interface with real filenames from IPFS
  const models: Model[] = useMemo(() => {
    if (!processedModels || !Array.isArray(processedModels)) {
      console.log("No models or not an array:", processedModels);
      return [];
    }

    console.log("Processing models:", processedModels.length);

    return processedModels.map((model: ContractModel, index: number) => ({
      id: `doc-${index}`,
      fileName: `Model ${index + 1}`, // This will be updated with real name from IPFS
      fileType: "unknown",
      fileSize: 0,
      cid: model.cId,
      modelId: model.modelId,
      uploader: model.uploader,
      uploadTime: Number(model.uploadTime),
      archived: model.archived,
      accessLevel: "private" as const,
    }));
  }, [processedModels]);

  // Update data validation to focus on user models
  const hasUserData = processedModels !== undefined;

  // Fetch real filenames from IPFS metadata
  const [modelNames, setModelNames] = useState<Map<string, string>>(new Map());

  useMemo(() => {
    if (!processedModels || !Array.isArray(processedModels)) return;

    const fetchAllNames = async () => {
      const namePromises = processedModels.map(async (model: ContractModel) => {
        const name = await fetchIPFSMetadata(model.cId);
        return { cid: model.cId, name };
      });

      try {
        const results = await Promise.allSettled(namePromises);
        const nameMap = new Map<string, string>();

        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            nameMap.set(processedModels[index].cId, result.value.name);
          } else {
            nameMap.set(processedModels[index].cId, `Model ${index + 1}`);
          }
        });

        setModelNames(nameMap);
      } catch (error) {
        console.error("Error fetching model names:", error);
      }
    };

    fetchAllNames();
  }, [processedModels, fetchIPFSMetadata]);

  // Final models with real names from IPFS
  const finalModels: Model[] = useMemo(() => {
    if (!models.length) return [];

    return models.map((doc) => ({
      ...doc,
      fileName: modelNames.get(doc.cid) || doc.fileName,
    }));
  }, [models, modelNames]);

  /**
   * Upload a model with encryption and IPFS storage
   */
  const uploadModel = useCallback(
    async (params: UploadModelParams) => {
      if (!activeAccount) {
        toast.error("Please connect your wallet first", {
          className: "toast-error",
        });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { modelId, cId } = params;

        console.log(
          "============================================\n useModels uploading at chainId: ",
          CHAIN_IDS.HEDERATESTNET,
          "\n============================================",
        );

        // Define the chain
        const hederaTestnet = defineChain(CHAIN_IDS.HEDERATESTNET);

        // Prepare the contract call using thirdweb
        const transaction = prepareContractCall({
          contract: {
            address: contracts.ModelRegistry.address,
            abi: contracts.ModelRegistry.abi,
            chain: hederaTestnet,
            client: thirdwebClient,
          },
          method: "uploadModel",
          params: [modelId, cId],
        });

        // Send transaction using thirdweb
        sendTransaction(transaction, {
          onSuccess: (result) => {
            console.log("Transaction successful:", result);
            toast.success("Model registered on blockchain!", {
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
          "============================================\n useModels Upload Model Function Called ",
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
    models: finalModels,
    events,
    modelCountPerAddress,
    isLoading: isLoading || isLoadingUserModels || isLoadingEvents,
    error:
      error ||
      (eventsError ? String(eventsError) : null) ||
      (modelsError ? String(modelsError) : null),
    getModelsByOwner,
    hasContractData: hasUserData,

    // Actions
    uploadModel,
  };
}

// Helper function to get human-readable event descriptions
export function getEventDescription(event: ModelRegistryEventData): string {
  switch (event.eventName) {
    case "ModelUploaded":
      return `Model uploaded: ${event.cid.substring(0, 10)}...`;
    case "RoleGranted":
      return `Role granted to ${event.account.substring(0, 6)}...${event.account.substring(38)}`;
    case "RoleRevoked":
      return `Role revoked from ${event.account.substring(0, 6)}...${event.account.substring(38)}`;
    default:
      return "Unknown event";
  }
}

// Helper function to get event icons/colors
export function getEventStyle(event: ModelRegistryEventData): {
  icon: string;
  color: string;
} {
  switch (event.eventName) {
    case "ModelUploaded":
      return { icon: "📄", color: "text-blue-600" };
    case "RoleGranted":
      return { icon: "✅", color: "text-green-600" };
    case "RoleRevoked":
      return { icon: "❌", color: "text-red-600" };
    default:
      return { icon: "❓", color: "text-gray-600" };
  }
}
