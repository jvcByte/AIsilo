// src/lib/wagmi.ts
import { createConfig, http, fallback } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";
import { APP_NAME, APP_DESCRIPTION, APP_URL, APP_ICON } from "./config";
import { blockdag } from "./bdag";

const wagmiConfig = createConfig(
    getDefaultConfig({
        chains: [blockdag, sepolia, mainnet],
        transports: {
            // BlockDAG - primary chain
            [blockdag.id]: http('https://rpc.awakening.bdagscan.com/', {
                timeout: 3_000, // 3 seconds
                retryCount: 3,
                batch: true
            }),

            // Sepolia - with Infura
            [sepolia.id]: fallback([
                http(`https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`, {
                    timeout: 3_000,
                    retryCount: 3,
                    batch: true
                }),
                http() // Fallback to public RPC
            ]),

            // Mainnet - add Infura or Alchemy (IMPORTANT!)
            [mainnet.id]: fallback([
                http(`https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`, {
                    timeout: 3_000,
                    retryCount: 3,
                    batch: true
                }),
                http() // Fallback to public RPC
            ])
        },

        // Performance optimizations
        enableFamily: false,
        ssr: false, // Set to true if using SSR

        // Required API Keys
        walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,

        // Required App Info
        appName: APP_NAME,
        appDescription: APP_DESCRIPTION,
        appUrl: APP_URL,
        appIcon: APP_ICON,
    })
);

export { wagmiConfig };
