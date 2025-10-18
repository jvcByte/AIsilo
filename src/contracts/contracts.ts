import type { Abi, Address } from "viem";
import MODELREG_ABI from "./abis/ModelRegistry";

type TContracts = Record<
  string,
  {
    address: Address;
    abi: Abi;
  }
>;

const contracts = {
  ModelRegistry: {
    address: "0xc5627F6103a9b569A2EAf7898ae44653a3F7f82F",
    abi: MODELREG_ABI,
  },
} as const satisfies TContracts;

export default contracts;
