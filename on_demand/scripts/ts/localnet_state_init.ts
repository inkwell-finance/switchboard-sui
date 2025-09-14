// sui client upgrade --upgrade-capability 0x75c9afab64928bbb62039f0b4f4bb4437e5312557583c4f3d350affd705cb1ba
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromBase64 as fromB64, toHex, fromHex } from "@mysten/sui/utils";
import {
  Oracle,
  Queue,
  State,
  SwitchboardClient,
} from "@switchboard-xyz/sui-sdk";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { SuiGraphQLClient } from "@mysten/sui/graphql";
import {
  getDefaultGuardianQueue,
  ON_DEMAND_DEVNET_GUARDIAN_QUEUE,
  ON_DEMAND_DEVNET_QUEUE,
  Oracle as SolanaOracle,
} from "@switchboard-xyz/on-demand";
import { config } from "dotenv";

config();

const ON_DEMAND_LOCALNET_STATE_OBJECT_ID = process.env.ON_DEMAND_LOCALNET_STATE_OBJECT_ID;
const ON_DEMAND_LOCALNET_OBJECT_PACKAGE_ID = process.env.ON_DEMAND_LOCALNET_OBJECT_PACKAGE_ID;
const DEPLOYER_KEYSTORE_PATH = process.env.DEPLOYER_KEYSTORE_PATH;
const DEPLOYER_ALIASES_PATH = process.env.DEPLOYER_ALIASES_PATH;
const DEPLOYER_ALIAS = process.env.DEPLOYER_ALIAS;

if (!ON_DEMAND_LOCALNET_STATE_OBJECT_ID) {
  throw new Error("Missing ON_DEMAND_LOCALNET_STATE_OBJECT_ID env var")
}
if (!ON_DEMAND_LOCALNET_OBJECT_PACKAGE_ID) {
  throw new Error("Missing ON_DEMAND_LOCALNET_OBJECT_PACKAGE_ID env var")
}
if (!ON_DEMAND_DEVNET_GUARDIAN_QUEUE) {
  throw new Error("Missing ON_DEMAND_DEVNET_GUARDIAN_QUEUE env var")
}
if (!ON_DEMAND_DEVNET_QUEUE) {
  throw new Error("Missing ON_DEMAND_DEVNET_QUEUE env var")
}

if (!DEPLOYER_KEYSTORE_PATH) {
  throw new Error("Missing DEPLOYER_KEYSTORE_PATH env var")
}
if (!DEPLOYER_ALIASES_PATH) {
  throw new Error("Missing DEPLOYER_ALIASES_PATH env var")
}

const LOCALNET_SUI_RPC = process.env.SUI_RPC_URL;

if (!LOCALNET_SUI_RPC) {
  throw new Error("Missing LOCALNET_SUI_RPC env var")
}

const client = new SuiClient({
  url: LOCALNET_SUI_RPC,
});

const sb = new SwitchboardClient(client, { stateObjectId: ON_DEMAND_LOCALNET_STATE_OBJECT_ID });

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

const adminCap = process.env.ADMIN_CAP;

if (!adminCap) {
  throw new Error("Missing ADMIN_CAP env var")
}

// create new user
const userAddress = keypair.getPublicKey().toSuiAddress();

console.log(`User account ${userAddress} loaded.`);

const guardianQueueInitTx = new Transaction();

// =================================================================================================
// Guardian Queue
// =================================================================================================

await Queue.initTx(sb, guardianQueueInitTx, {
  stateObjectId: ON_DEMAND_LOCALNET_STATE_OBJECT_ID,
  queueKey: ON_DEMAND_DEVNET_GUARDIAN_QUEUE.toBuffer().toString("hex"),
  authority: userAddress,
  name: "Localnet Guardian Queue",
  fee: 0,
  feeRecipient: userAddress,
  minAttestations: 3,
  oracleValidityLengthMs: 1000 * 60 * 60 * 24 * 365 * 5,
  isGuardianQueue: true,
  switchboardAddress: ON_DEMAND_LOCALNET_OBJECT_PACKAGE_ID,
});

// send the transaction
const guardianQueueTxResponse = await client.signAndExecuteTransaction({
  signer: keypair,
  transaction: guardianQueueInitTx,
  options: {
    showEffects: true,
  },
});

await client.waitForTransaction(guardianQueueTxResponse);

let guardianQueueId = "";
guardianQueueTxResponse.effects?.created?.forEach((c) => {
  if (c.reference.objectId) {
    guardianQueueId = c.reference.objectId;
  }
});
console.log("Guardian Queue ID:", guardianQueueId);

if (!guardianQueueId) {
  throw new Error("Failed to create guardian queue");
}

// =================================================================================================
// Oracle Queue
// =================================================================================================

const queueInitTx = new Transaction();

await Queue.initTx(sb, queueInitTx, {
  stateObjectId: ON_DEMAND_LOCALNET_STATE_OBJECT_ID,
  queueKey: ON_DEMAND_DEVNET_QUEUE.toBuffer().toString("hex"),
  authority: userAddress,
  name: "Localnet Oracle Queue",
  fee: 0,
  feeRecipient: userAddress,
  minAttestations: 3,
  oracleValidityLengthMs: 1000 * 60 * 60 * 24 * 7,
  guardianQueueId,
  switchboardAddress: ON_DEMAND_LOCALNET_OBJECT_PACKAGE_ID,
});

// send the transaction
const queueTxResponse = await client.signAndExecuteTransaction({
  signer: keypair,
  transaction: queueInitTx,
  options: {
    showEffects: true,
  },
});

await client.waitForTransaction(queueTxResponse);

let queueId = "";
queueTxResponse.effects?.created?.forEach((c) => {
  if (c.reference.objectId) {
    queueId = c.reference.objectId;
  }
});
console.log("Queue ID:", queueId);

if (!queueId) {
  throw new Error("Failed to create queue");
}

// =================================================================================================
// State Object Initialization
// =================================================================================================
const tx = new Transaction();
tx.moveCall({
  target: `${ON_DEMAND_LOCALNET_OBJECT_PACKAGE_ID}::set_package_id_action::run`,
  arguments: [
    tx.object(adminCap),
    tx.object(ON_DEMAND_LOCALNET_STATE_OBJECT_ID),
    tx.pure.id(ON_DEMAND_LOCALNET_OBJECT_PACKAGE_ID),
  ],
});

tx.moveCall({
  target: `${ON_DEMAND_LOCALNET_OBJECT_PACKAGE_ID}::set_guardian_queue_id_action::run`,
  arguments: [
    tx.object(adminCap),
    tx.object(ON_DEMAND_LOCALNET_STATE_OBJECT_ID),
    tx.pure.id(guardianQueueId),
  ],
});

tx.moveCall({
  target: `${ON_DEMAND_LOCALNET_OBJECT_PACKAGE_ID}::set_oracle_queue_id_action::run`,
  arguments: [
    tx.object(adminCap),
    tx.object(ON_DEMAND_LOCALNET_STATE_OBJECT_ID),
    tx.pure.id(queueId),
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

console.log(res);
console.log("Successfully initialized state object");
