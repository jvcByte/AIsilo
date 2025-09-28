# FileIt - Secure File Storage

A decentralized file storage application that encrypts your files using your wallet signature and stores them securely on IPFS with blockchain verification.

## What it does

- **Encrypts files** with wallet-based keys (no passwords needed)
- **Stores files** on IPFS for decentralized access
- **Verifies integrity** using blockchain-stored hashes
- **Controls access** through wallet permissions

## Quick Start

```bash
pnpm install
pnpm run dev
```

## 🔒 Security Features

### **Encryption**
- AES-256-GCM encryption
- Signature-derived keys (no key management needed)

## 🌐 Use Cases

- **Medical Records**: Secure patient data with doctor access
- **Legal Documents**: Confidential contracts and agreements
- **Financial Data**: Private financial records and statements
- **Personal Files**: Secure personal document storage
- **Enterprise Data**: Corporate file sharing with access controls

Connect your wallet and upload files securely.

## Future Plans

Wanted to implement **post-quantum cryptography**, but still studying the implementation details.