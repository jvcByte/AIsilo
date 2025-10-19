# AIsilo

AIsilo is a decentralized marketplace for AI models and datasets that combines client-side encryption, IPFS storage, and Hedera blockchain for immutable metadata and access control. The project demonstrates a secure pattern for uploading, encrypting, and sharing large files while keeping secret keys out of the server.

Key goals:
- Client-side AES-256-GCM encryption before upload
- Encrypted files stored on IPFS (Pinata)
- Metadata, ownership and audit trails recorded on Hedera
- Wallet-based authentication (no passwords)

---

## Quick Links

- Repository: https://github.com/jvcByte/AIsilo
- Hedera Testnet: https://hedera.com
- Pinata: https://pinata.cloud

---

## Quickstart

Prerequisites:
- Node.js 18+
- pnpm (or npm/yarn)
- Wallet (MetaMask / HashPack / WalletConnect)

Local development:

```bash
git clone https://github.com/jvcByte/AIsilo.git
cd AIsilo
pnpm install
cp .env.example .env
# Edit .env with your values (WalletConnect project id, Pinata gateway/jwt, server URL)
pnpm run dev
```

Available scripts:
- `pnpm run dev` — local dev server
- `pnpm run build` — production build
- `pnpm run preview` — preview production build
- `pnpm run lint` — lint the codebase

The app runs at http://localhost:5173 by default.

---

## Environment Variables

Create `.env` from `.env.example` and set at least:

- `VITE_WALLETCONNECT_PROJECT_ID` — WalletConnect Cloud project id
- `PINATA_JWT` — Pinata JWT (used server-side; do not expose publically)
- `VITE_PINATA_GATEWAY` — Pinata gateway URL
- `VITE_SERVER_URL` — Cloudflare Worker or backend for presigned URL generation

Note: Pinata JWTs should be kept server-side; the repo uses Cloudflare Workers to create presigned upload URLs.

---

## Features

- AES-256-GCM encryption in-browser using Web Crypto
- Deterministic key derivation from wallet signatures (Keccak256)
- Upload encrypted blobs to Pinata via presigned URLs
- Store CID + metadata on Hedera DocumentRegistry smart contract
- Wallet-based flows for upload, download and access control
- Real-time event feed from Hedera for recent activity

---

## Project Layout (key folders)

- `public/` — static assets
- `src/components/` — React components and UI
- `src/hooks/` — custom hooks (documents, activity)
- `src/lib/` — encryption, IPFS, and chain utilities
- `src/routes/` — TanStack Router route files
- `src/contracts/` — contract addresses and ABIs

---

## Smart Contracts

DocumentRegistry (Hedera testnet) stores metadata and emits events:
- uploadDocument(documentId, cid)
- getDocumentsByOwner(address)
- events: DocumentUploaded, RoleGranted, RoleRevoked

Contract address (example/test): `0x41c88BE9a1A761657E7B4569b89C5A20700F9f8A`

---

## Security Notes

- Encryption is done client-side; the server and Pinata cannot decrypt content without the user's wallet-derived key.
- Current key derivation is deterministic (Keccak256 of a wallet signature). Consider HKDF and per-file salts for production.
- Pinata JWTs must remain server-side; presigned uploads protect tokens from exposure.

---

## Contributing

Contributions welcome. Recommended workflow:
1. Fork the repo
2. Create a branch: `git checkout -b feature/xyz`
3. Open a PR with a clear description
4. Run tests / lint & ensure TypeScript passes

Please add tests and update docs for any public API changes.

---

## License

MIT — see the LICENSE file.

