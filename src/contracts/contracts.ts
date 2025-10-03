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
        address: "0x45638861C0b9dd4464360b6b32fCaA69E5d572D5",
        abi: DOCREG_ABI,
    },
} as const satisfies TContracts;

export default contracts;
