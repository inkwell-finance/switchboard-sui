import { getFieldsFromObject, ObjectParsingHelper } from "../index.js";
export class State {
    constructor(client, address) {
        this.client = client;
        this.address = address;
    }
    /**
     * Get the state data object
     */
    async loadData() {
        const receivedData = await this.client.client
            .getObject({
            id: this.address,
            options: {
                showContent: true,
                showType: true,
            },
        })
            .then(getFieldsFromObject);
        // return the data in camelCase
        return State.parseStateData(receivedData);
    }
    static parseStateData(receivedData) {
        // build from the result
        return {
            guardianQueue: ObjectParsingHelper.asString(receivedData.guardian_queue),
            id: ObjectParsingHelper.asId(receivedData.id),
            onDemandPackageId: ObjectParsingHelper.asString(receivedData.on_demand_package_id),
            oracleQueue: ObjectParsingHelper.asString(receivedData.oracle_queue),
        };
    }
    static async fetch(client, address) {
        const receivedData = await client
            .getObject({
            id: address,
            options: {
                showContent: true,
                showType: true,
            },
        })
            .then(getFieldsFromObject);
        return State.parseStateData(receivedData);
    }
}
//# sourceMappingURL=index.js.map