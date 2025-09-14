import type { SwitchboardClient } from "../index.js";
import type { SuiClient } from "@mysten/sui/client";
export interface StateData {
    id: string;
    guardianQueue: string;
    oracleQueue: string;
    onDemandPackageId: string;
}
export declare class State {
    readonly client: SwitchboardClient;
    readonly address: string;
    constructor(client: SwitchboardClient, address: string);
    /**
     * Get the state data object
     */
    loadData(): Promise<StateData>;
    static parseStateData(receivedData: any): StateData;
    static fetch(client: SuiClient, address: string): Promise<StateData>;
}
//# sourceMappingURL=index.d.ts.map