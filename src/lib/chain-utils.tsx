export interface ChainInfo {
  id: number;
  name: string;
  isTestnet: boolean;
  color: string;
  blockExplorerUrl?: string;
}

export const isTestnet = (chainId: number): boolean => {
  const testnets = [296]; // Hedera Testnet
  return testnets.includes(chainId);
};

export const getChainStatus = (chainId: number): "Mainnet" | "Testnet" => {
  return isTestnet(chainId) ? "Testnet" : "Mainnet";
};

export const formatChainName = (chainName: string): string => {
  // Remove common suffixes for cleaner display
  return chainName
    .replace(" Mainnet", "")
    .replace(" Testnet", "")
    .replace(" Network", "");
};

// Popular chain IDs for reference
export const CHAIN_IDS = {
  HEDERAMAINNET: 295,
  HEDERATESTNET: 296,
} as const;

// Chain priority for sorting (mainnet chains first, then testnets)
export const getChainPriority = (chainId: number): number => {
  const priorities: Record<number, number> = {
    [CHAIN_IDS.HEDERAMAINNET]: 1,
    [CHAIN_IDS.HEDERATESTNET]: 12,
  };
  return priorities[chainId] || 99;
};

export const sortChainsByPriority = <T extends { id: number }>(
  chains: T[],
): T[] => {
  return [...chains].sort(
    (a, b) => getChainPriority(a.id) - getChainPriority(b.id),
  );
};

export const getChainIcon = (chainId: number) => {
  switch (chainId) {
    case CHAIN_IDS.HEDERAMAINNET: // Hedera Mainnet
      return (
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-600" />
      );
    case CHAIN_IDS.HEDERATESTNET: // Hedera Testnet
      return (
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-orange-600" />
      );
    default:
      return (
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-400 to-gray-600" />
      );
  }
};
