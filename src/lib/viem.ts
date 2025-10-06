// src/lib/viem.ts
import { createPublicClient, http } from "viem";
import { getWalletClient } from "wagmi/actions";
import { wagmiConfig } from "./wagmi";
import { hederaTestnet } from "viem/chains";

export const publicClient = createPublicClient({
  chain: hederaTestnet,
  transport: http("https://testnet.hashio.io/api"),
});

// Returns the connected Wagmi Wallet Client or null if not available
export async function getWagmiWalletClient() {
  try {
    const client = await getWalletClient(wagmiConfig);
    return client ?? null;
  } catch {
    return null;
  }
}
