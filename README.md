# FileIt - Decentralized Encrypted File Storage

<div align="center">

![FileIt Logo](public/logo.png)

**A decentralized, blockchain-based secure data encryption and storage platform built on Hedera Network**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Hedera](https://img.shields.io/badge/Hedera-Testnet-purple.svg)](https://hedera.com)
[![IPFS](https://img.shields.io/badge/IPFS-Pinata-cyan.svg)](https://pinata.cloud)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Mission](#-mission)
- [Architecture](#-architecture)
- [Core Features](#-core-features)
- [Security Implementation](#-security-implementation)
- [Technology Stack](#-technology-stack)
- [Smart Contracts](#-smart-contracts)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Project Structure](#-project-structure)
- [Use Cases](#-use-cases)
- [API Reference](#-api-reference)
- [Compliance Standards](#-compliance-standards)
- [Contributing](#-contributing)

---

## 🎯 Overview

FileIt is a cutting-edge decentralized application (dApp) that provides strong, enterprise-grade encryption for file storage using blockchain technology. By combining **AES-256-GCM encryption**, **Hedera blockchain**, and **IPFS distributed storage**, FileIt ensures your sensitive documents remain secure, verifiable, and accessible only to authorized parties.

### Key Highlights

- 🔐 **Client-Side Encryption**: AES-256-GCM encryption in your browser before upload
- 🌐 **Decentralized Storage**: IPFS ensures no single point of failure
- ⛓️ **Blockchain Verification**: Hedera Network provides immutable audit trails
- 🔑 **Wallet-Based Access**: No passwords, no accounts - just your crypto wallet
- 🛡️ **Zero-Knowledge Architecture**: Even we can't access your files
- 📊 **Real-Time Activity Tracking**: Monitor all document events on-chain

---

## 🎯 Mission

Create a secure data encryption and storage platform designed with **NIST** and **ISO security principles** in mind, protecting data with strong cryptographic standards while enabling controlled access through wallet-based authentication.

### ISO 27001 Security Controls (Design Alignment)

**Note**: These are design goals aligned with ISO 27001 standards, not formal certifications.

- ✅ **A.9 Access Control**: Role-based access control via smart contracts
- ✅ **A.10 Cryptography**: AES-256-GCM encryption with key derivation
- ✅ **A.12 Operations Security**: Secure development and deployment practices
- ✅ **A.14 System Acquisition**: Security-first development lifecycle
- ✅ **A.18 Compliance**: Audit trails via blockchain events

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   React UI   │  │  Encryption  │  │    Wagmi     │         │
│  │  (TanStack)  │──│  (AES-256)   │──│  (Web3 SDK)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
         ┌────────────────────────────────────────┐
         │     Wallet (MetaMask/HashPack)        │
         │  - Sign Messages for Encryption       │
         │  - Sign Transactions for Blockchain   │
         └────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────────────┐
              ▼                                       ▼
    ┌─────────────────────┐                ┌──────────────────┐
    │ Cloudflare Worker   │                │ Hedera Testnet   │
    │ - Presigned URLs    │                │ - Smart Contract │
    │ - JWT Security      │                │ - Event Logs     │
    └──────────┬──────────┘                │ - Access Control │
               │                            └──────────────────┘
               ▼
    ┌──────────────────┐
    │  IPFS (Pinata)   │
    │  - Encrypted     │
    │    File Storage  │
    │  - CID Registry  │
    └──────────────────┘
```

### Data Flow

#### Upload Process

1. **File Selection**: User selects file in browser
2. **Wallet Signature**: User signs message "Encrypt My File"
3. **Key Derivation**: Keccak256 hash of signature → AES-256 key
4. **Encryption**: File encrypted with AES-256-GCM (generates IV)
5. **Presigned URL Request**: Frontend requests presigned URL from Cloudflare Worker
6. **Server Authentication**: Cloudflare Worker authenticates with Pinata using secure JWT
7. **IPFS Upload**: Encrypted file uploaded to Pinata via presigned URL
8. **Blockchain Record**: CID + metadata written to DocumentRegistry contract
9. **Event Emission**: `DocumentUploaded` event logged on-chain

#### Download Process

1. **CID Input**: User provides IPFS CID
2. **Wallet Signature**: User signs same message "Encrypt My File"
3. **Key Derivation**: Same signature → same AES-256 key
4. **IPFS Retrieval**: Encrypted file fetched from Pinata gateway
5. **Decryption**: File decrypted using derived key + stored IV
6. **File Download**: Decrypted file saved to user's device

---

## 🚀 Core Features

### 1. Strong Encryption (AES-256-GCM)

- **Algorithm**: AES-256-GCM (Galois/Counter Mode) - Uses NSA Suite B approved algorithm
- **Key Derivation**: Keccak256 hash of wallet signature (deterministic)
- **Authentication**: Built-in authentication tag prevents tampering
- **IV Generation**: Cryptographically secure random 16-byte IV per file
- **Key Length**: 256-bit (32-byte) encryption keys
- **Security Level**: Enterprise-grade encryption suitable for sensitive business and personal data
- **Note**: Implementation is not FIPS 140-2/3 validated

### 2. Blockchain Integration

- **Network**: Hedera Testnet (Chain ID: 296)
- **RPC Endpoint**: `https://testnet.hashio.io/api`
- **Smart Contract**: DocumentRegistry at `0x41c88BE9a1A761657E7B4569b89C5A20700F9f8A`
- **Features**:
  - Document registration with CID mapping
  - Role-based access control (RBAC)
  - Event emission for audit trails
  - Owner-based document queries

### 3. Decentralized Storage

- **Protocol**: IPFS (InterPlanetary File System)
- **Provider**: Pinata Cloud
- **Security Layer**: Cloudflare Workers for presigned URLs
- **Features**:
  - Content-addressed storage (CID)
  - Global CDN distribution
  - Metadata storage (IV, uploader address)
  - Presigned URL uploads (JWT tokens never exposed to frontend)
  - Server-side authentication via Cloudflare

### 4. User Interface

- **Framework**: React 19 with TypeScript
- **Routing**: TanStack Router (file-based routing)
- **State Management**: TanStack Query for async state
- **Styling**: Tailwind CSS v4 with custom components
- **Wallet Connection**: ConnectKit (supports MetaMask, WalletConnect, etc.)

### 5. Real-Time Activity Monitoring

- **Event Tracking**: Monitors blockchain events in real-time
- **Event Types**:
  - `DocumentUploaded`: New file registered
  - `RoleGranted`: Access permissions granted
  - `RoleRevoked`: Access permissions revoked
- **Time Window**: Last 6 days (Hedera RPC limitation)
- **Auto-Refresh**: Updates every 20 seconds

---

## 🔒 Security Implementation

### CIA Triad Compliance

#### Confidentiality

- **Client-Side Encryption**: Files never leave browser unencrypted
- **Key Management**: Keys derived from wallet signatures, never stored
- **Zero-Knowledge**: Server/IPFS nodes cannot decrypt files
- **Secure Key Derivation**: Keccak256 hash function (Ethereum standard)

#### Integrity

- **Blockchain Verification**: CIDs stored immutably on Hedera
- **Content Addressing**: IPFS CIDs are cryptographic hashes of content
- **Authentication Tags**: AES-GCM provides built-in integrity checks
- **Event Logs**: All actions recorded on-chain with timestamps

#### Availability

- **Distributed Storage**: IPFS ensures redundancy across nodes
- **No Single Point of Failure**: Decentralized architecture
- **Global CDN**: Pinata provides worldwide access
- **Blockchain Persistence**: Metadata permanently stored on-chain

### Encryption Technical Details

```typescript
// Key Derivation Process
function deriveEncryptionKey(signature: Address): Uint8Array {
  const keyMaterial = keccak256(utf8ToBytes(signature)); // 32-byte hash
  return keyMaterial.slice(0, 32); // AES-256 key
}

// Encryption Process
1. Generate random 16-byte IV
2. Import key into WebCrypto API
3. Encrypt file with AES-GCM
4. Return: { encrypted: hex, iv: hex }

// Decryption Process
1. Derive same key from signature
2. Import key into WebCrypto API
3. Decrypt with stored IV
4. Verify authentication tag
5. Return original file
```

### Security Best Practices

- ✅ No private keys stored in code or environment variables
- ✅ All encryption happens client-side in browser
- ✅ Signatures used for key derivation, not authentication
- ✅ IV (Initialization Vector) stored with each file
- ✅ HTTPS enforced for all network communications
- ✅ Smart contract access control via OpenZeppelin
- ✅ **Pinata JWT tokens secured server-side** (Cloudflare Workers)
- ✅ **Presigned URLs prevent frontend token exposure**
- ✅ Zero-trust architecture for IPFS uploads

### Cloudflare Worker Security Layer

FileIt uses **Cloudflare Workers** as a secure intermediary between the frontend and Pinata IPFS:

**Why This Matters:**
- **JWT Token Protection**: Pinata JWT tokens never exposed in frontend code or browser
- **Presigned URL Generation**: Server-side authentication with Pinata
- **Zero-Trust Upload**: Frontend receives temporary, scoped upload URLs
- **Rate Limiting**: Cloudflare's edge network provides DDoS protection
- **Global Performance**: Low-latency presigned URL generation worldwide

**Architecture Flow:**
```
Frontend → Cloudflare Worker → Pinata API → Presigned URL → Frontend
                ↓
         (JWT Token stays here, never exposed)
```

**Benefits:**
1. **Security**: JWT tokens remain server-side only
2. **Scalability**: Cloudflare's edge network handles requests
3. **Cost-Effective**: Serverless architecture with minimal overhead
4. **Compliance**: Meets security best practices for API key management

### Security Limitations & Considerations

**Current Implementation:**
- ⚠️ **Key Reuse**: Same wallet signature generates the same encryption key for all files
- ⚠️ **No Key Rotation**: Encryption keys are derived deterministically without rotation capability
- ⚠️ **No Salt in KDF**: Key derivation function lacks salt, making it deterministic
- ⚠️ **Browser-Based**: Encryption happens in browser (less secure than HSM)

**What This Means:**
- **Good For**: Personal documents, business files, general sensitive data
- **Not Suitable For**: Classified government data, data requiring FIPS 140-2/3 validation
- **Security Level**: **Enterprise-grade**, not military-grade

**Future Improvements:**
- Implement per-file unique key derivation with HKDF
- Add salt to key derivation process
- Implement key rotation mechanisms
- Add multi-signature support for shared files
- Consider HSM integration for production deployments

**Honest Assessment:**
FileIt provides **strong, enterprise-grade encryption** using industry-standard algorithms (AES-256-GCM). While the encryption algorithm itself is used by military systems, the overall implementation lacks some features required for true "military-grade" classification, such as FIPS-validated modules, HSM key storage, and formal security audits.

---

## 🛠 Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|----------|
| **React** | 19.1.1 | UI framework |
| **TypeScript** | 5.8.3 | Type safety |
| **Vite** | 7.1.2 | Build tool & dev server |
| **TanStack Router** | 1.131.41 | File-based routing |
| **TanStack Query** | 5.87.4 | Async state management |
| **Tailwind CSS** | 4.1.13 | Utility-first styling |
| **Radix UI** | Various | Accessible components |
| **Lucide React** | 0.544.0 | Icon library |

### Web3 & Blockchain

| Technology | Version | Purpose |
|------------|---------|----------|
| **Wagmi** | 2.16.9 | React hooks for Ethereum |
| **Viem** | 2.37.6 | TypeScript Ethereum library |
| **ConnectKit** | 1.9.1 | Wallet connection UI |
| **Hedera Network** | Testnet | Blockchain layer |

### Encryption & Storage

| Technology | Version | Purpose |
|------------|---------|----------|
| **ethereum-cryptography** | 1.2.0 | Keccak256, random bytes |
| **Web Crypto API** | Native | AES-256-GCM encryption |
| **Pinata SDK** | 2.5.1 | IPFS uploads/downloads |
| **IPFS** | - | Decentralized storage |
| **Cloudflare Workers** | - | Secure presigned URL generation |

### Development Tools

- **ESLint**: Code linting
- **pnpm**: Package manager
- **SWC**: Fast TypeScript compilation
- **Git**: Version control

---

## 📜 Smart Contracts

### DocumentRegistry Contract

**Address**: `0x41c88BE9a1A761657E7B4569b89C5A20700F9f8A` (Hedera Testnet)

#### Key Functions

```solidity
// Upload a new document
function uploadDocument(string _documentID, string _cid) external

// Get all documents
function getAllDocuments() external view returns (Documents[] memory)

// Get documents by owner
function getDocumentsByOwner(address owner) external view returns (Documents[] memory)

// Get document by CID
function getDocumentByCid(string _cid) external view returns (Documents memory)

// Get total document count
function getDocumentCount() external view returns (uint256)

// Role management
function grantRole(bytes32 role, address account) external
function revokeRole(bytes32 role, address account) external
function hasRole(bytes32 role, address account) external view returns (bool)
```

#### Data Structure

```solidity
struct Documents {
    string documentId;  // Unique document identifier
    string cId;         // IPFS Content Identifier
    address uploader;   // Wallet address of uploader
    uint256 uploadTime; // Block timestamp
    bool archived;      // Archive status
}
```

#### Events

```solidity
event DocumentUploaded(address indexed user, string docID, string cid);
event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
```

#### Access Control

- **DEFAULT_ADMIN_ROLE**: Full contract administration
- **USER_ROLE**: Standard user permissions
- Based on OpenZeppelin's AccessControl

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ recommended
- **pnpm**: v8+ (or npm/yarn)
- **Crypto Wallet**: MetaMask, HashPack, or WalletConnect-compatible
- **Hedera Testnet**: HBAR tokens (get from [Hedera Faucet](https://portal.hedera.com/faucet))

### Installation

```bash
# Clone the repository
git clone https://github.com/jvcByte/FileIt.git
cd FileIt

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration (see below)
nano .env
```

### Development

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Lint code
pnpm run lint
```

The development server will start at `http://localhost:5173`

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
# Wallet Connect
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# IPFS (Pinata)
PINATA_JWT=your_pinata_jwt_token
VITE_PINATA_GATEWAY=your_pinata_gateway_url

# Backend Server (Cloudflare Worker for presigned URLs)
VITE_SERVER_URL=your_cloudflare_worker_url

# App Metadata
VITE_APP_NAME=FileIt
VITE_APP_DESCRIPTION=Decentralized Encrypted File Storage
VITE_APP_URL=https://your-domain.com
VITE_APP_ICON=/logo.png
```

### Getting API Keys

#### WalletConnect Project ID
1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy the Project ID

#### Pinata (IPFS)
1. Sign up at [Pinata.cloud](https://pinata.cloud)
2. Generate API keys in dashboard
3. Create a dedicated gateway
4. Copy JWT token and gateway URL

#### Backend Server (Cloudflare)
The backend uses Cloudflare Workers to generate presigned URLs for secure IPFS uploads. This approach keeps your Pinata JWT tokens secure on the server-side, preventing exposure in the frontend. Deploy your own Cloudflare Worker or use the provided implementation.

---

## 📁 Project Structure

```
FileIt/
├── public/                  # Static assets
│   ├── logo.png
│   └── favicon.ico
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components (shadcn)
│   │   ├── layout/         # Layout components (header, footer)
│   │   ├── upload-file.tsx # File upload component
│   │   ├── upload-text.tsx # Text encryption component
│   │   ├── download-file.tsx # File download/decrypt
│   │   └── recent-activity.tsx # Blockchain event viewer
│   ├── contracts/          # Smart contract ABIs & configs
│   │   ├── abis/
│   │   │   └── DocumentRegistry.ts
│   │   ├── contracts.ts    # Contract addresses
│   │   └── events.ts       # Event definitions
│   ├── hooks/              # Custom React hooks
│   │   ├── use-documents.ts # Document management hook
│   │   └── use-mobile.ts
│   ├── lib/                # Utility libraries
│   │   ├── encryption.ts   # AES-256-GCM encryption
│   │   ├── ipfs.ts        # Pinata SDK setup
│   │   ├── viem.ts        # Viem client config
│   │   ├── wagmi.ts       # Wagmi config
│   │   ├── config.ts      # App configuration
│   │   └── utils.ts       # Helper functions
│   ├── routes/             # TanStack Router pages
│   │   ├── __root.tsx
│   │   ├── index.tsx      # Landing page
│   │   ├── docs.tsx       # Documentation page
│   │   └── _authenticated/ # Protected routes
│   │       ├── dashboard.tsx
│   │       ├── upload-file.tsx
│   │       ├── download-file.tsx
│   │       └── activities.tsx
│   ├── styles/             # Global styles
│   └── main.tsx           # App entry point
├── .env.example            # Environment template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🌐 Use Cases

### Healthcare & Medical
- **HIPAA Compliance**: Secure patient records and medical imaging
- **Telemedicine**: Encrypted doctor-patient communications
- **Research Data**: Protected clinical trial data

### Financial Services
- **Financial Records**: Private financial statements and tax documents
- **KYC Documents**: Secure identity verification files
- **Audit Trails**: Immutable transaction records

### Legal & Corporate
- **Legal Documents**: Confidential contracts and agreements
- **IP Protection**: Patent applications and trade secrets
- **Corporate Records**: Board meeting minutes and strategic plans

### Government & Defense
- **Classified Data**: Secure handling of sensitive government information
- **Citizen Records**: Protected personal identification documents
- **Inter-Agency Communication**: Encrypted file sharing

### Personal Use
- **Password Vaults**: Encrypted credential backups
- **Personal Documents**: Birth certificates, passports, wills
- **Private Media**: Personal photos and videos

---

## 📚 API Reference

### useDocuments Hook

Custom React hook for document management:

```typescript
const {
  documents,           // Array of all documents
  events,             // Blockchain events (last 6 days)
  documentCount,      // Total document count
  isLoading,          // Loading state
  error,              // Error state
  uploadDocument,     // Upload function
  getDocumentsByOwner // Get user's documents
} = useDocuments();
```

### Encryption Functions

```typescript
// Encrypt a file
const { encrypted, iv } = await encryptFile(
  file: File,
  signature: Address
);

// Decrypt a file
const decryptedFile = await decryptFile(
  encryptedHex: string,
  ivHex: string,
  signature: Address,
  fileName: string,
  mimeType: string
);

// Encrypt text
const { encrypted, iv } = await encryptText(
  text: string,
  signature: Address
);
```

### IPFS Operations

```typescript
// Upload to IPFS
const upload = await pinata.upload
  .public.file(file)
  .url(presignedUrl)
  .keyvalues({ iv, user: address });

// Download from IPFS
const { data } = await pinata.gateways.public.get(cid);
```

---

## ✅ Security Standards & Compliance

**Important Note**: FileIt is designed with security best practices in mind but is **not formally certified or audited**. The following describes alignment with industry standards:

### NIST Cryptographic Standards (Algorithm Alignment)

- **NIST SP 800-175B**: Uses approved cryptographic algorithms
  - ✅ AES-256-GCM (approved algorithm)
  - ✅ 256-bit key length
  - ✅ Cryptographically secure random IV generation
  - ⚠️ **Note**: Implementation is not FIPS 140-2/3 validated

- **NIST SP 800-53**: Security control design principles
  - ✅ AC-3: Access Enforcement (smart contract RBAC)
  - ✅ SC-13: Cryptographic Protection (AES-256-GCM)
  - ✅ AU-2: Audit Events (blockchain logs)

### ISO 27001:2013 (Design Alignment)

FileIt's architecture aligns with these ISO 27001 control objectives:

- **A.9**: Access Control - Wallet-based authentication and smart contract permissions
- **A.10**: Cryptography - Strong encryption with proper key management principles
- **A.12**: Operations Security - Secure development practices
- **A.14**: System Acquisition - Security-first development lifecycle
- **A.18**: Compliance - Immutable audit trails via blockchain

**Disclaimer**: These are design alignments, not formal ISO 27001 certifications.

### GDPR Considerations

- **Right to Erasure**: Files can be unpinned from IPFS
- **Data Portability**: Users control their encryption keys
- **Privacy by Design**: Zero-knowledge architecture
- **Data Minimization**: Only CID and metadata stored on-chain

### What FileIt IS and IS NOT

**✅ FileIt IS:**
- Built with industry-standard cryptographic algorithms
- Designed following security best practices
- Suitable for business and personal sensitive data
- Transparent about security implementation

**❌ FileIt IS NOT:**
- FIPS 140-2/3 validated
- Formally audited by third-party security firms
- ISO 27001 certified
- Suitable for classified government data requiring formal certifications

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure code passes linting (`pnpm run lint`)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **GitHub**: [https://github.com/jvcByte/FileIt](https://github.com/jvcByte/FileIt)
- **Hedera Network**: [https://hedera.com](https://hedera.com)
- **HashScan Explorer**: [https://hashscan.io/testnet](https://hashscan.io/testnet)
- **IPFS**: [https://ipfs.io](https://ipfs.io)
- **Pinata**: [https://pinata.cloud](https://pinata.cloud)

---

## 📞 Support

For questions, issues, or feature requests:

- Open an issue on [GitHub](https://github.com/jvcByte/FileIt/issues)
- Contact: [Your contact information]

---

## 🙏 Acknowledgments

- **Hedera Hashgraph** for the fast, secure blockchain infrastructure
- **IPFS** for decentralized storage protocol
- **OpenZeppelin** for secure smart contract libraries
- **Pinata** for IPFS pinning services
- **shadcn/ui** for beautiful UI components

---

<div align="center">

**Built with ❤️ for a more secure, decentralized future**

[⬆ Back to Top](#fileit---decentralized-encrypted-file-storage)

</div>
