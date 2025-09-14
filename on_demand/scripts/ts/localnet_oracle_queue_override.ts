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
  getDefaultDevnetQueue,
  getDefaultQueue,
  OracleAccountData,
  Oracle as SolanaOracle,
} from "@switchboard-xyz/on-demand";
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

if (!DEPLOYER_ALIAS) {
  throw new Error("DEPLOYER_ALIAS not set");
}


const LOCALNET_SUI_RPC = process.env.SUI_RPC_URL!;
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

// create new user
const userAddress = keypair.getPublicKey().toSuiAddress();

console.log(`User account ${userAddress} loaded.`);

console.log("Initializing LOCALNET Oracle Queue Setup");
const chainID = await client.getChainIdentifier();

console.log(`Chain ID: ${chainID}`);

const state = new State(sb, ON_DEMAND_LOCALNET_STATE_OBJECT_ID);
const stateData = await state.loadData();

console.log("State Data: ", stateData);

const queue = new Queue(sb, stateData.oracleQueue);
console.log("Queue Data: ", await queue.loadData());

const switchboardObjectAddress = ON_DEMAND_LOCALNET_OBJECT_PACKAGE_ID;
const gql = new SuiGraphQLClient({
  url: "http://localhost:9125/graphql",
});

const allOracles = await queue.loadOracleData();
console.log("All Oracles: ", allOracles);

//================================================================================================
// Initialize Oracles
//================================================================================================

// Load all the oracles on the solana queue
const solanaQueue = await getDefaultDevnetQueue();
const solanaOracleKeys = await solanaQueue.fetchOracleKeys();
const solanaOracles = await SolanaOracle.loadMany(
  solanaQueue.program,
  solanaOracleKeys
).then((oracles) => {
  return oracles.map<OracleAccountData & { pubkey: any }>((o, i) => {
    return {
      ...o!,
      pubkey: solanaOracleKeys[i],
    };
  });
});

// Initialize the oracles
console.log(
  "Initializing/Updating Solana Oracles, oracles:",
  solanaOracles.length
);

const oracleTx = new Transaction();

let oracleInits = 0;
let oracleUpdates = 0;

for (const oracle of solanaOracles) {
  console.log("Oracle: ", oracle.pubkey.toBase58());
  if (allOracles.find((o) => o.oracleKey === oracle.pubkey.toBase58())) {
    const o = allOracles.find((o) => o.oracleKey === oracle.pubkey.toBase58());
    // console.log(o);
    console.log("Oracle Key: ", oracle, o);
    if (o && o.secp256k1Key === toHex(oracle.enclave.enclaveSigner.toBytes())) {
      console.log("Oracle already initialized");
      continue;
    } else if (o) {
      console.log("Oracle found, updating", oracle.pubkey.toBase58());
      oracleUpdates++;
      await queue.overrideOracleTx(oracleTx, {
        stateObjectId: ON_DEMAND_LOCALNET_STATE_OBJECT_ID,
        switchboardAddress: switchboardObjectAddress,
        oracleQueueId: stateData.oracleQueue,
        oracle: o.id, // sui oracle id
        secp256k1Key: toHex(oracle.enclave.enclaveSigner.toBytes()),
        mrEnclave: toHex(oracle.enclave.mrEnclave),
        expirationTimeMs: Date.now() + 1000 * 60 * 60 * 24 * 365 * 5,
      });
    }
  } else {
    console.log("Oracle not found, initializing", oracle.pubkey.toBase58());
    oracleInits++;
    console.log(toHex(oracle.pubkey.toBuffer()));
    await Oracle.initTx(sb, oracleTx, {
      stateObjectId: ON_DEMAND_LOCALNET_STATE_OBJECT_ID,
      oracleKey: toHex(oracle.pubkey.toBuffer()),
    });
  }
}

const senderClient = new SuiClient({
  url: LOCALNET_SUI_RPC,
});

if (oracleInits > 0 || oracleUpdates > 0) {
  console.log("Executing Oracle Init/Update Transaction");
  console.log(oracleTx.getData());
  const res = await senderClient.signAndExecuteTransaction({
    signer: keypair,
    transaction: oracleTx,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });
  console.log(res);
}

// load all oracles
const allOraclesAfter = await Oracle.loadAllOracles(
  gql,
  switchboardObjectAddress
);
console.log("All Oracles After: ", allOraclesAfter);
