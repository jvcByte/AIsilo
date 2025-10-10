import { defineChain } from "thirdweb/chains";


// Define Hedera Testnet chain for thirdweb
const hederaTestnetChain = defineChain({
    id: 296,
    name: "Hedera Testnet",
    rpc: "https://testnet.hashio.io/api",
    blockExplorers: [
        {
            name: "Hashscan",
            url: "https://hashscan.io/testnet",
        },
    ],
    nativeCurrency: {
        name: "HBAR",
        symbol: "HBAR",
        decimals: 18,
    },
    testnet: true,
});

export { hederaTestnetChain };