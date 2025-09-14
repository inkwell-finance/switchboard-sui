import { Oracle } from "./oracle/index.js";
import { Queue } from "./queue/index.js";
import { State } from "./state/index.js";
import { TTLCache } from "@brokerloop/ttlcache";
import BN from "bn.js";
export { Oracle, Queue, State };
export * from "./aggregator/index.js";
export * from "./oracle/index.js";
export * from "./queue/index.js";
export * from "./state/index.js";
export * from "@switchboard-xyz/on-demand";
export const ON_DEMAND_MAINNET_OBJECT_PACKAGE_ID = "0xc3c7e6eb7202e9fb0389a2f7542b91cc40e4f7a33c02554fec11c4c92f938ea3";
export const ON_DEMAND_MAINNET_STATE_OBJECT_ID = "0x93d2a8222bb2006d16285ac858ec2ae5f644851917504b94debde8032664a791";
export const ON_DEMAND_TESTNET_OBJECT_PACKAGE_ID = "0xdd96e1c8d6d61c4642b9b73eefb1021cc5f93f489b794bca11c81d55fcf43ce2";
export const ON_DEMAND_TESTNET_STATE_OBJECT_ID = "0x2086fdde07a8f4726a3fc72d6ef1021343a781d42de6541ca412cf50b4339ad6";
// ==============================================================================
// Caching for Fetch Update Ix
// 1 min cache for sui cache
export const suiQueueCache = new TTLCache({
    ttl: 1000 * 60,
});
// 5 min solana queue cache - reloads the sol program every 5 minutes max
export const solanaProgramCache = new TTLCache({
    ttl: 1000 * 60 * 5,
});
export class SwitchboardClient {
    constructor(client, options) {
        this.client = client;
        this.state = getSwitchboardState(client, options);
    }
    /**
     * Fetch the current state of the Switchboard (on-demand package ID, guardian queue ID, oracle queue ID)
     * @param retries Number of retries to fetch the state
     */
    async fetchState(options, retries = 3) {
        var _a, _b, _c;
        if (retries <= 0) {
            throw new Error("Failed to fetch Switchboard state after multiple attempts");
        }
        try {
            const state = await this.state;
            if (!state) {
                this.state = getSwitchboardState(this.client, options);
                return this.fetchState(options, retries - 1);
            }
            return {
                switchboardAddress: (_a = options === null || options === void 0 ? void 0 : options.switchboardAddress) !== null && _a !== void 0 ? _a : state.switchboardAddress,
                guardianQueueId: (_b = options === null || options === void 0 ? void 0 : options.guardianQueueId) !== null && _b !== void 0 ? _b : state.guardianQueueId,
                oracleQueueId: (_c = options === null || options === void 0 ? void 0 : options.oracleQueueId) !== null && _c !== void 0 ? _c : state.oracleQueueId,
                mainnet: state.mainnet,
            };
        }
        catch (error) {
            console.error("Error fetching Switchboard state, retrying...");
            return this.fetchState(options, retries - 1);
        }
    }
}
// Helper function to get the Switchboard state
export async function getSwitchboardState(client, options) {
    var _a, _b, _c, _d, _e;
    try {
        const chainId = (_a = options === null || options === void 0 ? void 0 : options.chainId) !== null && _a !== void 0 ? _a : (await client.getChainIdentifier());
        const mainnet = chainId !== "4c78adac"; // Check if mainnet or testnet
        console.log("Chain ID:", chainId);
        console.log("Mainnet:", mainnet);
        console.log("Options:", options);
        const stateObjectId = (_b = options === null || options === void 0 ? void 0 : options.stateObjectId) !== null && _b !== void 0 ? _b : (mainnet ? ON_DEMAND_MAINNET_STATE_OBJECT_ID : ON_DEMAND_TESTNET_STATE_OBJECT_ID);
        console.log("State Object ID:", stateObjectId);
        const data = await State.fetch(client, stateObjectId);
        return {
            switchboardAddress: (_c = options === null || options === void 0 ? void 0 : options.switchboardAddress) !== null && _c !== void 0 ? _c : data.onDemandPackageId,
            guardianQueueId: (_d = options === null || options === void 0 ? void 0 : options.guardianQueueId) !== null && _d !== void 0 ? _d : data.guardianQueue,
            oracleQueueId: (_e = options === null || options === void 0 ? void 0 : options.oracleQueueId) !== null && _e !== void 0 ? _e : data.oracleQueue,
            mainnet,
        };
    }
    catch (error) {
        console.error("Failed to retrieve Switchboard state:", error);
    }
}
export function getFieldsFromObject(response) {
    var _a;
    console.log("Response:", response);
    // Check if 'data' and 'content' exist and are of the expected type
    if (((_a = response.data) === null || _a === void 0 ? void 0 : _a.content) &&
        response.data.content.dataType === "moveObject" &&
        !Array.isArray(response.data.content.fields) &&
        !("type" in response.data.content.fields)) {
        // Safely return 'fields' from 'content'
        return response.data.content.fields;
    }
    throw new Error("Invalid response data");
}
export class ObjectParsingHelper {
    static asString(value) {
        if (typeof value === "string") {
            return value;
        }
        throw new Error("Invalid Move String");
    }
    static asNumber(value) {
        try {
            return parseInt(value);
        }
        catch (e) {
            throw new Error("Invalid Move Number");
        }
    }
    static asArray(value) {
        if (Array.isArray(value)) {
            return value;
        }
        throw new Error("Invalid MoveValueArray");
    }
    static asUint8Array(value) {
        if (Array.isArray(value) && value.every((v) => typeof v === "number")) {
            return new Uint8Array(value);
        }
        throw new Error("Invalid Move Uint8Array");
    }
    static asId(value) {
        if (typeof value === "object" && "id" in value) {
            const idWrapper = value;
            return idWrapper.id;
        }
        throw new Error("Invalid Move Id");
    }
    static asStruct(value) {
        if (typeof value === "object" && !Array.isArray(value)) {
            return value;
        }
        throw new Error("Invalid Move Struct");
    }
    // Parse switchboard move decimal into BN, whether or not nested in "fields"
    static asBN(value) {
        if (typeof value !== "object") {
            throw new Error("Invalid Move BN Input Type");
        }
        const target = "fields" in value ? value.fields : value;
        if (typeof target === "object" && "value" in target && "neg" in target) {
            return new BN(target.value.toString()).mul(target.neg ? new BN(-1) : new BN(1));
        }
        throw new Error("Invalid Move BN");
    }
}
//# sourceMappingURL=index.js.map