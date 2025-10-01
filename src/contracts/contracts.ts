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
        address: "0x61D2670eB04D837f30d61B9f5535100cB1C42C2d",
        abi: DOCREG_ABI,
    },
} as const satisfies TContracts;

export default contracts;
