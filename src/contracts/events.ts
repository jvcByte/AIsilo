// contracts/events.ts
import { parseAbiItem } from "viem";

export interface DocumentUploadedEvent {
  user: `0x${string}`;
  docID: string;
  cid: string;
}

export interface RoleGrantedEvent {
  role: `0x${string}`;
  account: `0x${string}`;
  sender: `0x${string}`;
}

export interface RoleRevokedEvent {
  role: `0x${string}`;
  account: `0x${string}`;
  sender: `0x${string}`;
}

export interface RoleAdminChangedEvent {
  role: `0x${string}`;
  previousAdminRole: `0x${string}`;
  newAdminRole: `0x${string}`;
}

// Union type for all Document Registry events
export type DocumentRegistryEvent =
  | (DocumentUploadedEvent & { eventName: "DocumentUploaded" })
  | (RoleGrantedEvent & { eventName: "RoleGranted" })
  | (RoleRevokedEvent & { eventName: "RoleRevoked" })
  | (RoleAdminChangedEvent & { eventName: "RoleAdminChanged" });

export const DOCUMENT_REGISTRY_EVENTS = {
  DocumentUploaded: parseAbiItem(
    "event DocumentUploaded(address indexed user, string docID, string cid)",
  ),
  RoleGranted: parseAbiItem(
    "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
  ),
  RoleRevoked: parseAbiItem(
    "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)",
  ),
  RoleAdminChanged: parseAbiItem(
    "event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)",
  ),
} as const;

// Event names array for easier iteration
export const DOCUMENT_REGISTRY_EVENT_NAMES = Object.keys(
  DOCUMENT_REGISTRY_EVENTS,
) as Array<keyof typeof DOCUMENT_REGISTRY_EVENTS>;

// Helper type for decoded events with metadata
export type DecodedDocumentRegistryEvent = DocumentRegistryEvent & {
  blockNumber: bigint;
  transactionHash: `0x${string}`;
  logIndex: number;
  address: `0x${string}`;
};
