// src/lib/wagmi.ts
import { createConfig, http } from "wagmi";
import { hedera, hederaTestnet } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";
import { APP_NAME, APP_DESCRIPTION, APP_URL, APP_ICON } from "./config";

const wagmiConfig = createConfig(
    getDefaultConfig({
        chains: [hedera, hederaTestnet],
        transports: {
            // Hedera - primary chain
            [hedera.id]: http('https://mainnet.hashio.io/api', {
                timeout: 3_000, // 3 seconds
                retryCount: 3,
                batch: true
            }),
            // Hedera Testnet - primary chain
            [hederaTestnet.id]: http('https://testnet.hashio.io/api', {
                timeout: 3_000, // 3 seconds
                retryCount: 3,
                batch: true
            }),
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
