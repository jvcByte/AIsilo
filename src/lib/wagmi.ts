import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";
import { APP_NAME, APP_DESCRIPTION, APP_URL, APP_ICON } from "./config";

// BlockDAG Network Configuration
const blockdag = {
  id: 1043,
  name: 'BlockDAG',
  network: 'blockdag',
  nativeCurrency: {
    decimals: 18,
    name: 'BlockDAG',
    symbol: 'BDAG',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.awakening.bdagscan.com/'],
    },
    public: {
      http: ['https://rpc.awakening.bdagscan.com/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BlockDAG Explorer',
      url: 'https://awakening.bdagscan.com/',
    },
  },
  testnet: true,
} as const;

const wagmiConfig = createConfig(
    getDefaultConfig({
        chains: [mainnet, sepolia, blockdag],
        transports: {
            [blockdag.id]: http ('https://rpc.awakening.bdagscan.com/'),
            [mainnet.id]: http(),
            [sepolia.id]: http(
                `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`,
            ),
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
