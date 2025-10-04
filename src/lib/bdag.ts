
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

export {blockdag}