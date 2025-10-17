import { Shield, Lock, Database, Zap, BookOpen, Key } from "lucide-react";

const sections = [
  {
    id: "overview",
    title: "Overview",
    icon: BookOpen,
    content:
      "AIsilo combines AES-256-GCM encryption, Hedera blockchain, and IPFS to provide strong security for your files with zero-knowledge architecture.",
  },
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Zap,
    content:
      "Connect your wallet, sign a message for encryption, and upload files. All encryption happens in your browser before upload.",
  },
  {
    id: "architecture",
    title: "Architecture",
    icon: Database,
    content:
      "Decentralized system with client-side encryption, IPFS storage, and Hedera blockchain for immutable audit trails.",
  },
  {
    id: "security",
    title: "Security",
    icon: Shield,
    content:
      "AES-256-GCM encryption (uses NSA Suite B approved algorithm) with Keccak256 key derivation from wallet signatures. Files are encrypted before leaving your browser.",
  },
  {
    id: "smart-contracts",
    title: "Smart Contracts",
    icon: Lock,
    content:
      "DocumentRegistry contract on Hedera Testnet manages document metadata, access control, and emits events for audit trails.",
  },
  {
    id: "technology",
    title: "Technology Stack",
    icon: Key,
    content:
      "Built with React 19, TypeScript, Wagmi, Viem, TanStack Router/Query, Tailwind CSS, and Pinata for IPFS storage.",
  },
];

export { sections };
