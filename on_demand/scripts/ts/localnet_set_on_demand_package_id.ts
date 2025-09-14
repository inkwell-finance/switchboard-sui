// sui client upgrade --upgrade-capability 0x75c9afab64928bbb62039f0b4f4bb4437e5312557583c4f3d350affd705cb1ba
import { SuiClient } from "@mysten/sui/client";
import { SuiGraphQLClient } from "@mysten/sui/graphql";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { fromBase64 as fromB64, SUI_TYPE_ARG, toHex } from "@mysten/sui/utils";
import {
  Queue,
  State,
  SwitchboardClient,
} from "@switchboard-xyz/sui-sdk";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { config } from "dotenv";

config();

const ON_DEMAND_LOCALNET_OBJECT_PACKAGE_ID = process.env.ON_DEMAND_LOCALNET_OBJECT_PACKAGE_ID;
const ON_DEMAND_LOCALNET_STATE_OBJECT_ID = process.env.ON_DEMAND_LOCALNET_STATE_OBJECT_ID;
const DEPLOYER_KEYSTORE_PATH = process.env.DEPLOYER_KEYSTORE_PATH;
const DEPLOYER_ALIASES_PATH = process.env.DEPLOYER_ALIASES_PATH;
const DEPLOYER_ALIAS = process.env.DEPLOYER_ALIAS;



if (!ON_DEMAND_LOCALNET_OBJECT_PACKAGE_ID) {
  throw new Error("ON_DEMAND_LOCALNET_OBJECT_PACKAGE_ID not set");
}

if (!ON_DEMAND_LOCALNET_STATE_OBJECT_ID) {
  throw new Error("ON_DEMAND_LOCALNET_STATE_OBJECT_ID not set");
}

if (!DEPLOYER_KEYSTORE_PATH) {
  throw new Error("DEPLOYER_KEYSTORE_PATH not set");
}

if (!DEPLOYER_ALIASES_PATH) {
  throw new Error("DEPLOYER_ALIASES_PATH not set");
}

const LOCALNET_SUI_RPC = process.env.SUI_RPC_URL!;
const client = new SuiClient({
  url: LOCALNET_SUI_RPC,
});
const sb = new SwitchboardClient(client);
let keypair: Ed25519Keypair | null = null;

try {
  const aliases = JSON.parse(fs.readFileSync(DEPLOYER_ALIASES_PATH, "utf-8"));
  const aliasIndex = aliases.findIndex((a: any) => a.alias === DEPLOYER_ALIAS);
  const keystore = JSON.parse(fs.readFileSync(DEPLOYER_KEYSTORE_PATH, "utf-8"));
  // Ensure the keystore has at least 4 keys
  if (keystore.length < 4) {
    throw new Error("Keystore has fewer than 4 keys.");
  }

  // Access the 4th key (index 3) and decode from base64
  const secretKey = fromB64(keystore[aliasIndex]);
  keypair = Ed25519Keypair.fromSecretKey(secretKey.slice(1)); // Slice to remove the first byte if needed
} catch (error) {
  console.log("Error:", error);
}

if (!keypair) {
  throw new Error("Keypair not loaded");
}

//================================================================================================
// Initialization and Logging
//================================================================================================

// create new user
const userAddress = keypair.getPublicKey().toSuiAddress();

console.log(`User account ${userAddress} loaded.`);

console.log("Initializing LOCALNET Setup");
const chainID = await client.getChainIdentifier();

console.log(`Chain ID: ${chainID}`);

const stateAddress = ON_DEMAND_LOCALNET_STATE_OBJECT_ID;
const state = new State(sb, stateAddress);
const stateData = await state.loadData();

console.log("State Data: ", stateData);

const queue = new Queue(sb, stateData.oracleQueue);
console.log("Queue Data: ", await queue.loadData());

const switchboardAddress = ON_DEMAND_LOCALNET_OBJECT_PACKAGE_ID;

const adminCapAddress =
  "0xc256f2b0a61af132f705a5a9d345edcc802fecba3213d6002265dfeb576ece90";

const new_on_demand_package_id =
  "0x578b91ec9dcc505439b2f0ec761c23ad2c533a1c23b0467f6c4ae3d9686709f6";

const tx = new Transaction();
tx.moveCall({
  target: `${switchboardAddress}::set_package_id_action::run`,
  arguments: [
    tx.object(adminCapAddress),
    tx.object(stateAddress),
    tx.pure.id(new_on_demand_package_id),
  ],
});

const res = await client.signAndExecuteTransaction({
  signer: keypair,
  transaction: tx,
  options: {
    showEffects: true,
    showObjectChanges: true,
  },
});

console.log("On Demand Set Package ID Response: ", res);
