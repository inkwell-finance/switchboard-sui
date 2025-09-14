import type { CommonOptions, OracleData, SwitchboardClient } from "../index.js";
import type { Transaction } from "@mysten/sui/transactions";
export interface QueueInitParams extends CommonOptions {
    queueKey: string;
    authority: string;
    name: string;
    fee: number;
    feeRecipient: string;
    minAttestations: number;
    oracleValidityLengthMs: number;
    guardianQueueId?: string;
    isGuardianQueue?: boolean;
}
export interface QueueSetConfigsParams extends CommonOptions {
    name: string;
    fee: number;
    feeRecipient: string;
    minAttestations: number;
    oracleValidityLengthMs: number;
}
export interface QueueSetAuthorityParams extends CommonOptions {
    newAuthority: string;
}
export interface QueueOverrideOracleParams extends CommonOptions {
    oracle: string;
    secp256k1Key: string;
    mrEnclave: string;
    expirationTimeMs: number;
}
export interface QueueSetFeeTypeParams extends CommonOptions {
    feeType: string;
}
export interface QueueData {
    authority: string;
    existingOracles: {
        oracleId: string;
        oracleKey: string;
    }[];
    fee: number;
    feeRecipient: string;
    feeTypes: {
        type: string;
        fields: Record<string, unknown>;
    }[];
    guardianQueueId: string;
    id: string;
    lastQueueOverrideMs: number;
    minAttestations: number;
    name: string;
    oracleValidityLengthMs: number;
    queueKey: string;
}
export declare class Queue {
    readonly client: SwitchboardClient;
    readonly address: string;
    constructor(client: SwitchboardClient, address: string);
    /**
     * Create a new Queue
     */
    static initTx(client: SwitchboardClient, tx: Transaction, options: QueueInitParams): Promise<void>;
    /**
     * Queue set configs tx
     */
    setConfigsTx(tx: Transaction, options: QueueSetConfigsParams): Promise<void>;
    /**
     * Queue set authority tx
     */
    setAuthorityTx(tx: Transaction, options: QueueSetAuthorityParams): Promise<void>;
    /**
     * Queue override oracle tx
     */
    overrideOracleTx(tx: Transaction, options: QueueOverrideOracleParams): Promise<void>;
    /**
     * Queue add fee type tx
     */
    addFeeTypeTx(tx: Transaction, options: QueueSetFeeTypeParams): Promise<void>;
    /**
     * Queue remove fee type tx
     */
    removeFeeTypeTx(tx: Transaction, options: QueueSetFeeTypeParams): Promise<void>;
    /**
     * Get the queue data object
     */
    loadData(): Promise<QueueData>;
    /**
     * Load oracle data
     */
    loadOracleData(): Promise<OracleData[]>;
}
//# sourceMappingURL=index.d.ts.map