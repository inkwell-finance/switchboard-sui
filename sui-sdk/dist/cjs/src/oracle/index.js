"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oracle = void 0;
var index_js_1 = require("../index.js");
var _2024_4_1 = require("@mysten/sui/graphql/schemas/2024.4");
var utils_1 = require("@mysten/sui/utils");
var on_demand_1 = require("@switchboard-xyz/on-demand");
var Oracle = /** @class */ (function () {
    function Oracle(client, address) {
        this.client = client;
        this.address = address;
    }
    /**
     * Create a new Oracle
     */
    Oracle.initTx = function (client, tx, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, switchboardAddress, oracleQueueId, guardianQueueId, queueId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, client.fetchState(options)];
                    case 1:
                        _a = _b.sent(), switchboardAddress = _a.switchboardAddress, oracleQueueId = _a.oracleQueueId, guardianQueueId = _a.guardianQueueId;
                        queueId = options.isGuardian ? guardianQueueId : oracleQueueId;
                        tx.moveCall({
                            target: "".concat(switchboardAddress, "::oracle_init_action::run"),
                            arguments: [
                                tx.pure.vector("u8", Array.from((0, utils_1.fromHex)(options.oracleKey))),
                                tx.object(queueId),
                            ],
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Oracle attest Tx
     */
    Oracle.prototype.attestTx = function (tx, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, switchboardAddress, oracleQueueId, guardianQueueId, queueId, oracleData, suiQueue, queue, suiGuardianQueue, queue, solanaGuardianQueue, guardianGateways, getBridgingMessages, bridgeMessages, i, _b, _c, _d;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.client.fetchState(options)];
                    case 1:
                        _a = _e.sent(), switchboardAddress = _a.switchboardAddress, oracleQueueId = _a.oracleQueueId, guardianQueueId = _a.guardianQueueId;
                        queueId = options.isGuardian ? guardianQueueId : oracleQueueId;
                        return [4 /*yield*/, this.loadData()];
                    case 2:
                        oracleData = _e.sent();
                        suiQueue = index_js_1.suiQueueCache.get(oracleData.queue);
                        if (!!suiQueue) return [3 /*break*/, 4];
                        return [4 /*yield*/, new index_js_1.Queue(this.client, queueId).loadData()];
                    case 3:
                        queue = _e.sent();
                        index_js_1.suiQueueCache.set(queueId, queue);
                        suiQueue = queue;
                        _e.label = 4;
                    case 4:
                        suiGuardianQueue = index_js_1.suiQueueCache.get(suiQueue.guardianQueueId);
                        if (!!suiGuardianQueue) return [3 /*break*/, 6];
                        return [4 /*yield*/, new index_js_1.Queue(this.client, suiQueue.guardianQueueId).loadData()];
                    case 5:
                        queue = _e.sent();
                        index_js_1.suiQueueCache.set(suiQueue.guardianQueueId, queue);
                        suiGuardianQueue = queue;
                        _e.label = 6;
                    case 6:
                        if (!(suiGuardianQueue.queueKey == on_demand_1.ON_DEMAND_MAINNET_GUARDIAN_QUEUE.toBase58())) return [3 /*break*/, 9];
                        solanaGuardianQueue = index_js_1.solanaProgramCache.get(on_demand_1.ON_DEMAND_MAINNET_GUARDIAN_QUEUE.toBase58());
                        if (!!solanaGuardianQueue) return [3 /*break*/, 8];
                        return [4 /*yield*/, (0, on_demand_1.getDefaultGuardianQueue)(options.solanaRPCUrl)];
                    case 7:
                        solanaGuardianQueue = _e.sent();
                        index_js_1.solanaProgramCache.set(on_demand_1.ON_DEMAND_MAINNET_GUARDIAN_QUEUE.toBase58(), solanaGuardianQueue);
                        _e.label = 8;
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        if (!(suiQueue.queueKey == on_demand_1.ON_DEMAND_DEVNET_GUARDIAN_QUEUE.toBase58())) return [3 /*break*/, 11];
                        solanaGuardianQueue = index_js_1.solanaProgramCache.get(on_demand_1.ON_DEMAND_DEVNET_GUARDIAN_QUEUE.toBase58());
                        if (!!solanaGuardianQueue) return [3 /*break*/, 11];
                        return [4 /*yield*/, (0, on_demand_1.getDefaultDevnetGuardianQueue)(options.solanaRPCUrl)];
                    case 10:
                        solanaGuardianQueue = _e.sent();
                        index_js_1.solanaProgramCache.set(on_demand_1.ON_DEMAND_DEVNET_GUARDIAN_QUEUE.toBase58(), solanaGuardianQueue);
                        _e.label = 11;
                    case 11: return [4 /*yield*/, solanaGuardianQueue.fetchAllGateways()];
                    case 12:
                        guardianGateways = _e.sent();
                        getBridgingMessages = function () { return __awaiter(_this, void 0, void 0, function () {
                            var gateways, gatewayPromises, messages;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        // shuffle the gateways
                                        guardianGateways.sort(function () { return Math.random() - 0.5; });
                                        gateways = guardianGateways.slice(0, options.minAttestations);
                                        gatewayPromises = gateways.map(function (g) {
                                            return g.fetchBridgingMessage({
                                                chainHash: "0".repeat(64),
                                                oraclePubkey: (0, utils_1.toHex)((0, utils_1.fromBase58)(oracleData.oracleKey)),
                                                queuePubkey: (0, utils_1.toHex)((0, utils_1.fromBase58)(oracleData.queueKey)),
                                            });
                                        });
                                        return [4 /*yield*/, Promise.allSettled(gatewayPromises)];
                                    case 1:
                                        messages = _a.sent();
                                        // get the bridge messages
                                        return [2 /*return*/, messages
                                                .map(function (m) {
                                                if (m.status === "fulfilled") {
                                                    return m.value;
                                                }
                                            })
                                                .filter(function (m) { return m; })];
                                }
                            });
                        }); };
                        bridgeMessages = [];
                        i = 0;
                        _e.label = 13;
                    case 13:
                        if (!(i < 3)) return [3 /*break*/, 16];
                        _c = (_b = bridgeMessages.push).apply;
                        _d = [bridgeMessages];
                        return [4 /*yield*/, getBridgingMessages()];
                    case 14:
                        _c.apply(_b, _d.concat([(_e.sent())]));
                        if (bridgeMessages.length >= options.minAttestations) {
                            return [3 /*break*/, 16];
                        }
                        _e.label = 15;
                    case 15:
                        i++;
                        return [3 /*break*/, 13];
                    case 16:
                        // if we don't have enough bridge messages - throw an error
                        if (bridgeMessages.length < options.minAttestations) {
                            throw new Error("Not enough bridge messages");
                        }
                        bridgeMessages.forEach(function (message) {
                            var _a;
                            var signature = Array.from((0, utils_1.fromBase64)(message.signature));
                            signature.push(message.recovery_id);
                            var mrEnclave = message.mr_enclave;
                            var secp256k1Key = message.oracle_secp256k1_enclave_signer;
                            var guardian = (0, utils_1.toBase58)((0, utils_1.fromHex)(message.guardian));
                            var guardianId = (_a = suiGuardianQueue.existingOracles.find(function (o) { return o.oracleKey === guardian; })) === null || _a === void 0 ? void 0 : _a.oracleId;
                            if (!guardianId) {
                                console.error("Guardian not found", guardian);
                                return;
                            }
                            tx.moveCall({
                                target: "".concat(switchboardAddress, "::oracle_attest_action::run"),
                                arguments: [
                                    tx.object(_this.address),
                                    tx.object(oracleData.queue),
                                    tx.object(guardianId),
                                    tx.pure.u64(message.timestamp),
                                    tx.pure.vector("u8", Array.from((0, utils_1.fromHex)(mrEnclave))),
                                    tx.pure.vector("u8", Array.from((0, utils_1.fromHex)(secp256k1Key))),
                                    tx.pure.vector("u8", signature),
                                    tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
                                ],
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Oracle.parseOracleData = function (oracleData) {
        return {
            expirationTime: index_js_1.ObjectParsingHelper.asNumber(oracleData.expiration_time_ms),
            id: index_js_1.ObjectParsingHelper.asId(oracleData.id),
            mrEnclave: (0, utils_1.toHex)(index_js_1.ObjectParsingHelper.asUint8Array(oracleData.mr_enclave)),
            oracleKey: (0, utils_1.toBase58)(index_js_1.ObjectParsingHelper.asUint8Array(oracleData.oracle_key)),
            queue: index_js_1.ObjectParsingHelper.asString(oracleData.queue),
            queueKey: (0, utils_1.toBase58)(index_js_1.ObjectParsingHelper.asUint8Array(oracleData.queue_key)),
            secp256k1Key: (0, utils_1.toHex)(index_js_1.ObjectParsingHelper.asUint8Array(oracleData.secp256k1_key)),
            validAttestations: index_js_1.ObjectParsingHelper.asArray(oracleData.valid_attestations),
        };
    };
    /**
     * Get the oracle data object
     */
    Oracle.prototype.loadData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var oracleData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.client
                            .getObject({
                            id: this.address,
                            options: {
                                showContent: true,
                                showType: true,
                            },
                        })
                            .then(index_js_1.getFieldsFromObject)];
                    case 1:
                        oracleData = _a.sent();
                        return [2 /*return*/, Oracle.parseOracleData(oracleData)];
                }
            });
        });
    };
    Oracle.loadAllOracles = function (graphqlClient, switchboardAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var fetchAggregatorsQuery, result, oracleData;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        fetchAggregatorsQuery = (0, _2024_4_1.graphql)("\n      query {\n        objects(\n          filter: {\n            type: \"".concat(switchboardAddress, "::oracle::Oracle\"\n          }\n        ) {\n          nodes {\n            address\n            digest\n            asMoveObject {\n              contents {\n                json\n              }\n            }\n          }\n        }\n      }\n    "));
                        return [4 /*yield*/, graphqlClient.query({
                                query: fetchAggregatorsQuery,
                            })];
                    case 1:
                        result = _d.sent();
                        oracleData = (_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.objects) === null || _b === void 0 ? void 0 : _b.nodes) === null || _c === void 0 ? void 0 : _c.map(function (result) {
                            var moveObject = result.asMoveObject.contents.json;
                            // build the data object from moveObject which looks like the above json
                            return {
                                expirationTime: index_js_1.ObjectParsingHelper.asNumber(moveObject.expiration_time_ms),
                                id: moveObject.id,
                                mrEnclave: (0, utils_1.toHex)(index_js_1.ObjectParsingHelper.asUint8Array(moveObject.mr_enclave)),
                                oracleKey: (0, utils_1.toBase58)(index_js_1.ObjectParsingHelper.asUint8Array(moveObject.oracle_key)),
                                queue: index_js_1.ObjectParsingHelper.asString(moveObject.queue),
                                queueKey: (0, utils_1.toBase58)(index_js_1.ObjectParsingHelper.asUint8Array(moveObject.queue_key)),
                                secp256k1Key: (0, utils_1.toHex)(index_js_1.ObjectParsingHelper.asUint8Array(moveObject.secp256k1_key)),
                                validAttestations: index_js_1.ObjectParsingHelper.asArray(moveObject.valid_attestations),
                            };
                        });
                        return [2 /*return*/, oracleData];
                }
            });
        });
    };
    Oracle.loadMany = function (client, oracles) {
        return __awaiter(this, void 0, void 0, function () {
            var oracleData;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.client
                            .multiGetObjects({
                            ids: oracles,
                            options: {
                                showContent: true,
                                showType: true,
                            },
                        })
                            .then(function (o) { return o.map(index_js_1.getFieldsFromObject); })];
                    case 1:
                        oracleData = _a.sent();
                        return [2 /*return*/, oracleData.map(function (o) { return _this.parseOracleData(o); })];
                }
            });
        });
    };
    return Oracle;
}());
exports.Oracle = Oracle;
//# sourceMappingURL=index.js.map