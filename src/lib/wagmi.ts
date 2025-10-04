import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";
import { APP_NAME, APP_DESCRIPTION, APP_URL, APP_ICON } from "./config";
import { blockdag } from "./bdag";

const wagmiConfig = createConfig(
    getDefaultConfig({
        chains: [mainnet, sepolia, blockdag],
        transports: {
            [blockdag.id]: http('https://rpc.awakening.bdagscan.com/'),
            [mainnet.id]: http(),
            [sepolia.id]: http(`https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`),
        },
        enableFamily: false,
        // Required API Keys
        walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,

        // Required App Info
        appName: APP_NAME,

        // Optional App Info
        appDescription: APP_DESCRIPTION,
        appUrl: APP_URL,
        appIcon: APP_ICON,
    }),
);

export { wagmiConfig };
