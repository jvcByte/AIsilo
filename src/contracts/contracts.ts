import type { Abi, Address } from "viem";
import DOCREG_ABI from "./abis/DocumentRegistry";

type TContracts = Record<
  string,
  {
    address: Address;
    abi: Abi;
  }
>;

const contracts = {
  DocumentRegistry: {
    address: "0x41c88BE9a1A761657E7B4569b89C5A20700F9f8A",
    abi: DOCREG_ABI,
  },
} as const satisfies TContracts;

export default contracts;
