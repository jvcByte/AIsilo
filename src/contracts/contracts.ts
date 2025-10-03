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
        address: "0xA125622Fd6da9C8FBdd623766e6984A6f79F0909",
        abi: DOCREG_ABI,
    },
} as const satisfies TContracts;

export default contracts;
