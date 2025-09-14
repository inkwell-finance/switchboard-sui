import type { CommonOptions, SwitchboardClient } from "../index.js";
import type { SuiGraphQLClient } from "@mysten/sui/graphql";
import type { Transaction } from "@mysten/sui/transactions";
export interface OracleInitParams extends CommonOptions {
    oracleKey: string;
    isGuardian?: boolean;
}
export interface OracleAttestParams extends CommonOptions {
    minAttestations: number;
    isGuardian?: boolean;
    solanaRPCUrl?: string;
}
export interface OracleData {
    expirationTime: number;
    id: string;
    mrEnclave: string;
    oracleKey: string;
    queue: string;
    queueKey: string;
    secp256k1Key: string;
    validAttestations: any[];
}
export declare class Oracle {
    readonly client: SwitchboardClient;
    readonly address: string;
    constructor(client: SwitchboardClient, address: string);
    /**
     * Create a new Oracle
     */
    static initTx(client: SwitchboardClient, tx: Transaction, options: OracleInitParams): Promise<void>;
    /**
     * Oracle attest Tx
     */
    attestTx(tx: Transaction, options: OracleAttestParams): Promise<void>;
    static parseOracleData(oracleData: any): OracleData;
    /**
     * Get the oracle data object
     */
    loadData(): Promise<OracleData>;
    static loadAllOracles(graphqlClient: SuiGraphQLClient, switchboardAddress: string): Promise<OracleData[]>;
    static loadMany(client: SwitchboardClient, oracles: string[]): Promise<OracleData[]>;
}
//# sourceMappingURL=index.d.ts.map