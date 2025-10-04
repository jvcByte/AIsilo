// src/lib/viem.ts
import { createPublicClient, http } from "viem";
import { getWalletClient } from "wagmi/actions";
import { wagmiConfig } from "./wagmi";
import {blockdag} from "./bdag";

export const publicClient = createPublicClient({
    chain: blockdag,
    transport: http('https://rpc.awakening.bdagscan.com'),
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