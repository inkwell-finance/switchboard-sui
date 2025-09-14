import type { CommonOptions, SwitchboardClient } from "../index.js";
import { Queue } from "../index.js";
import type { SuiGraphQLClient } from "@mysten/sui/graphql";
import type { Transaction } from "@mysten/sui/transactions";
import { CrossbarClient } from "@switchboard-xyz/common";
import type { FeedEvalResponse } from "@switchboard-xyz/on-demand";
import type BN from "bn.js";
export interface AggregatorInitParams extends CommonOptions {
    authority: string;
    name: string;
    feedHash: string;
    minSampleSize: number;
    maxStalenessSeconds: number;
    maxVariance: number;
    minResponses: number;
}
export interface AggregatorConfigParams extends CommonOptions {
    aggregator: string;
    name: string;
    feedHash: string;
    minSampleSize: number;
    maxStalenessSeconds: number;
    maxVariance: number;
    minResponses: number;
}
export interface AggregatorSetAuthorityParams extends CommonOptions {
    aggregator: string;
    newAuthority: string;
}
export interface AggregatorConfigs {
    feedHash: string;
    maxVariance: number;
    minResponses: number;
    minSampleSize: number;
}
export interface AggregatorFetchUpdateIxParams extends CommonOptions {
    solanaRPCUrl?: string;
    crossbarUrl?: string;
    crossbarClient?: CrossbarClient;
    feedConfigs?: AggregatorConfigs;
    queue?: Queue;
}
export interface CurrentResultData {
    maxResult: BN;
    maxTimestamp: number;
    mean: BN;
    minResult: BN;
    minTimestamp: number;
    range: BN;
    result: BN;
    stdev: BN;
}
export interface Update {
    oracle: string;
    value: BN;
    timestamp: number;
}
export interface AggregatorData {
    id: string;
    authority: string;
    createdAtMs: number;
    currentResult: CurrentResultData;
    feedHash: string;
    maxStalenessSeconds: number;
    maxVariance: number;
    minResponses: number;
    minSampleSize: number;
    name: string;
    queue: string;
    updateState: {
        currIdx: number;
        results: Update[];
    };
}
export declare class Aggregator {
    readonly client: SwitchboardClient;
    readonly address: string;
    crossbarClient?: CrossbarClient;
    feedHash?: string;
    constructor(client: SwitchboardClient, address: string);
    /**
     * Create a new Aggregator
     * @param client - SuiClient
     * @param tx - Transaction
     * @param options - AggregatorInitParams
     * @constructor
     */
    static initTx(client: SwitchboardClient, tx: Transaction, options: AggregatorInitParams): Promise<void>;
    /**
     * Set configs for the Aggregator
     * @param tx - Transaction
     * @param options - AggregatorConfigParams
     */
    setConfigsTx(tx: Transaction, options: AggregatorConfigParams): Promise<void>;
    /**
     * Set the feed authority
     * @param tx - Transaction
     * @param options - AggregatorSetAuthorityParams
     */
    setAuthorityTx(tx: Transaction, options: AggregatorSetAuthorityParams): Promise<void>;
    /**
     * Pull feed tx
     * @param tx - Transaction
     * @param options - CommonOptions
     */
    fetchUpdateTx(tx: Transaction, options?: AggregatorFetchUpdateIxParams): Promise<{
        responses: FeedEvalResponse[];
        failures: string[];
    }>;
    /**
     * Get the feed data object
     */
    loadData(): Promise<AggregatorData>;
    /**
     * Load all feeds
     */
    static loadAllFeeds(graphqlClient: SuiGraphQLClient, switchboardAddress: string): Promise<AggregatorData[]>;
}
//# sourceMappingURL=index.d.ts.map