# FileIt

A decentralized, blockchain-based secure data encrypting and storage platform built on BlockDAG.

## 🎯 Mission

Create a secure data encrypting and storage platform that inherently meets NIST or ISO compliance standards, protecting data to the highest cybersecurity standards while enabling controlled access through wallet-based authentication.

### **ISO 27001 Controls**
- ✅ **A.9 Access Control**: Comprehensive access management
- ✅ **A.10 Cryptography**: Strong encryption and key management
- ✅ **A.12 Operations Security**: Secure operations
- ✅ **A.14 System Acquisition**: Secure development lifecycle

## 🚀 Core Features

### **Advanced Encryption (NIST SP 800-175B)**
- **AES-256-GCM** authenticated encryption

## 🌐 Use Cases

### **Healthcare & Medical**
- **HIPAA Compliance**: Healthcare data protection standards

### **Financial Services**
- **Financial Records**: Private financial data and statements

### **Legal & Corporate**
- **Legal Documents**: Confidential contracts and agreements

### **Government & Defense**
- **Classified Data**: Secure handling of sensitive government information

## 🛠 Technical Implementation

### **Blockchain Integration**
- **BlockDAG Network**: Primary blockchain for data integrity
- **Smart Contracts**: DocumentRegistry for access control
- **IPFS Storage**: Decentralized file storage
- **Hash Verification**: Blockchain-stored integrity hashes

### **Security Architecture**
- **Zero-Knowledge**: No central authority can access data
- **End-to-End Encryption**: Data encrypted before storage
- **Wallet-Based Authentication**: No passwords or accounts needed
- **Decentralized Storage**: No single point of failure

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
pnpm run dev
```

## 🔧 Chain info

### **BlockDAG Network**
```env
BLOCKDAG_RPC_URL=https://rpc.awakening.bdagscan.com/
CHAIN_ID=1043
```
