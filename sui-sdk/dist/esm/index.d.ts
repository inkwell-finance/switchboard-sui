import { Oracle } from "./oracle/index.js";
import type { QueueData } from "./queue/index.js";
import { Queue } from "./queue/index.js";
import { State } from "./state/index.js";
import { TTLCache } from "@brokerloop/ttlcache";
import type { MoveStruct, MoveValue, SuiObjectResponse } from "@mysten/sui/client";
import type { SuiClient } from "@mysten/sui/client";
import type { Queue as SolanaQueue } from "@switchboard-xyz/on-demand";
import BN from "bn.js";
export { Oracle, Queue, State };
export * from "./aggregator/index.js";
export * from "./oracle/index.js";
export * from "./queue/index.js";
export * from "./state/index.js";
export * from "@switchboard-xyz/on-demand";
export declare const ON_DEMAND_MAINNET_OBJECT_PACKAGE_ID = "0xc3c7e6eb7202e9fb0389a2f7542b91cc40e4f7a33c02554fec11c4c92f938ea3";
export declare const ON_DEMAND_MAINNET_STATE_OBJECT_ID = "0x93d2a8222bb2006d16285ac858ec2ae5f644851917504b94debde8032664a791";
export declare const ON_DEMAND_TESTNET_OBJECT_PACKAGE_ID = "0xdd96e1c8d6d61c4642b9b73eefb1021cc5f93f489b794bca11c81d55fcf43ce2";
export declare const ON_DEMAND_TESTNET_STATE_OBJECT_ID = "0x2086fdde07a8f4726a3fc72d6ef1021343a781d42de6541ca412cf50b4339ad6";
export declare const suiQueueCache: TTLCache<string, QueueData>;
export declare const solanaProgramCache: TTLCache<string, SolanaQueue>;
export interface SwitchboardState {
    switchboardAddress: string;
    guardianQueueId: string;
    oracleQueueId: string;
    mainnet: boolean;
}
export interface CommonOptions {
    switchboardAddress?: string;
    stateObjectId?: string;
    guardianQueueId?: string;
    oracleQueueId?: string;
    chainId?: string;
}
export declare class SwitchboardClient {
    readonly client: SuiClient;
    state: Promise<SwitchboardState | undefined>;
    constructor(client: SuiClient, options?: CommonOptions);
    /**
     * Fetch the current state of the Switchboard (on-demand package ID, guardian queue ID, oracle queue ID)
     * @param retries Number of retries to fetch the state
     */
    fetchState(options?: CommonOptions, retries?: number): Promise<SwitchboardState>;
}
export declare function getSwitchboardState(client: SuiClient, options?: CommonOptions): Promise<SwitchboardState | undefined>;
export declare function getFieldsFromObject(response: SuiObjectResponse): {
    [key: string]: MoveValue;
};
export declare class ObjectParsingHelper {
    static asString(value: MoveValue): string;
    static asNumber(value: MoveValue): number;
    static asArray(value: MoveValue): MoveValue[];
    static asUint8Array(value: MoveValue): Uint8Array;
    static asId(value: MoveValue): string;
    static asStruct(value: MoveValue): MoveStruct;
    static asBN(value: MoveValue): BN;
}
//# sourceMappingURL=index.d.ts.map