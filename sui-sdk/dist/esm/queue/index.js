import { getFieldsFromObject, ObjectParsingHelper } from "../index.js";
import { Oracle } from "../oracle/index.js";
import { fromHex, toBase58 } from "@mysten/sui/utils";
import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui/utils";
export class Queue {
    constructor(client, address) {
        this.client = client;
        this.address = address;
    }
    /**
     * Create a new Queue
     */
    static async initTx(client, tx, options) {
        const { switchboardAddress } = await client.fetchState(options);
        if (options.isGuardianQueue) {
            tx.moveCall({
                target: `${switchboardAddress}::guardian_queue_init_action::run`,
                arguments: [
                    tx.pure.vector("u8", Array.from(fromHex(options.queueKey))),
                    tx.pure.address(options.authority),
                    tx.pure.string(options.name),
                    tx.pure.u64(options.fee),
                    tx.pure.address(options.feeRecipient),
                    tx.pure.u64(options.minAttestations),
                    tx.pure.u64(options.oracleValidityLengthMs),
                ],
            });
        }
        else {
            if (!options.guardianQueueId) {
                throw new Error("guardianQueueId is required for non-guardian queues");
            }
            tx.moveCall({
                target: `${switchboardAddress}::oracle_queue_init_action::run`,
                arguments: [
                    tx.pure.vector("u8", Array.from(fromHex(options.queueKey))),
                    tx.pure.address(options.authority),
                    tx.pure.string(options.name),
                    tx.pure.u64(options.fee),
                    tx.pure.address(options.feeRecipient),
                    tx.pure.u64(options.minAttestations),
                    tx.pure.u64(options.oracleValidityLengthMs),
                    tx.object(options.guardianQueueId),
                ],
            });
        }
    }
    /**
     * Queue set configs tx
     */
    async setConfigsTx(tx, options) {
        const { switchboardAddress } = await this.client.fetchState(options);
        tx.moveCall({
            target: `${switchboardAddress}::queue_set_configs_action::run`,
            arguments: [
                tx.object(this.address),
                tx.pure.string(options.name),
                tx.pure.u64(options.fee),
                tx.pure.address(options.feeRecipient),
                tx.pure.u64(options.minAttestations),
                tx.pure.u64(options.oracleValidityLengthMs),
            ],
        });
    }
    /**
     * Queue set authority tx
     */
    async setAuthorityTx(tx, options) {
        const { switchboardAddress } = await this.client.fetchState(options);
        tx.moveCall({
            target: `${switchboardAddress}::queue_set_authority_action::run`,
            arguments: [
                tx.object(this.address),
                tx.pure.address(options.newAuthority),
            ],
        });
    }
    /**
     * Queue override oracle tx
     */
    async overrideOracleTx(tx, options) {
        const { switchboardAddress } = await this.client.fetchState(options);
        tx.moveCall({
            target: `${switchboardAddress}::queue_override_oracle_action::run`,
            arguments: [
                tx.object(this.address),
                tx.object(options.oracle),
                tx.pure.vector("u8", Array.from(fromHex(options.secp256k1Key))),
                tx.pure.vector("u8", Array.from(fromHex(options.mrEnclave))),
                tx.pure.u64(options.expirationTimeMs),
                tx.object(SUI_CLOCK_OBJECT_ID),
            ],
        });
    }
    /**
     * Queue add fee type tx
     */
    async addFeeTypeTx(tx, options) {
        const { switchboardAddress } = await this.client.fetchState(options);
        tx.moveCall({
            target: `${switchboardAddress}::queue_add_fee_type_action::run`,
            arguments: [tx.object(this.address)],
            typeArguments: [options.feeType],
        });
    }
    /**
     * Queue remove fee type tx
     */
    async removeFeeTypeTx(tx, options) {
        const { switchboardAddress } = await this.client.fetchState(options);
        tx.moveCall({
            target: `${switchboardAddress}::queue_remove_fee_type_action::run`,
            arguments: [tx.object(this.address)],
            typeArguments: [options.feeType],
        });
    }
    /**
     * Get the queue data object
     */
    async loadData() {
        const rpcResponseData = await this.client.client
            .getObject({
            id: this.address,
            options: {
                showContent: true,
                showType: true,
            },
        })
            .then(getFieldsFromObject);
        // Fetch the exisitng oracles
        const existingOraclesResponse = rpcResponseData.existing_oracles;
        const existingOraclesObjects = [];
        let existingOraclesDynamicFields = await this.client.client.getDynamicFields({
            parentId: existingOraclesResponse.fields.id.id,
        });
        existingOraclesObjects.push(...existingOraclesDynamicFields.data);
        while (existingOraclesDynamicFields.hasNextPage) {
            existingOraclesDynamicFields = await this.client.client.getDynamicFields({
                parentId: existingOraclesDynamicFields.nextCursor,
            });
            existingOraclesObjects.push(...existingOraclesDynamicFields.data);
        }
        // fetch existing oracles objects
        const realExistingOraclesContents = await this.client.client.multiGetObjects({
            ids: existingOraclesObjects.map((o) => {
                return o.objectId;
            }),
            options: {
                showContent: true,
            },
        });
        // parse the existing oracles
        const existingOracles = realExistingOraclesContents.map((o) => {
            const fields = getFieldsFromObject(o);
            return {
                oracleId: ObjectParsingHelper.asString(fields.value.fields.oracle_id),
                oracleKey: toBase58(ObjectParsingHelper.asUint8Array(fields.value.fields.oracle_key)),
            };
        });
        // build from the result
        const data = {
            // get authority address
            authority: ObjectParsingHelper.asString(rpcResponseData.authority),
            // get existing oracles (TODO)
            existingOracles: existingOracles,
            // get fee number (though encoded as string)
            fee: ObjectParsingHelper.asNumber(rpcResponseData.fee),
            // fee recipient address
            feeRecipient: ObjectParsingHelper.asString(rpcResponseData.fee_recipient),
            // accepted fee coin types
            feeTypes: ObjectParsingHelper.asArray(rpcResponseData.fee_types).map((ft) => ft.fields.name),
            // guardian queue id
            guardianQueueId: ObjectParsingHelper.asString(rpcResponseData.guardian_queue_id),
            // queue id
            id: ObjectParsingHelper.asId(rpcResponseData.id),
            // last queue override ms
            lastQueueOverrideMs: ObjectParsingHelper.asNumber(rpcResponseData.last_queue_override_ms),
            // minimum attestations
            minAttestations: ObjectParsingHelper.asNumber(rpcResponseData.min_attestations),
            // queue name
            name: ObjectParsingHelper.asString(rpcResponseData.name),
            oracleValidityLengthMs: ObjectParsingHelper.asNumber(rpcResponseData.oracle_validity_length_ms),
            // get source queue key
            queueKey: toBase58(ObjectParsingHelper.asUint8Array(rpcResponseData.queue_key)),
        };
        return data;
    }
    /**
     * Load oracle data
     */
    async loadOracleData() {
        const queueData = await this.loadData();
        const oracleIds = queueData.existingOracles.map((o) => o.oracleId);
        return Oracle.loadMany(this.client, oracleIds);
    }
}
//# sourceMappingURL=index.js.map