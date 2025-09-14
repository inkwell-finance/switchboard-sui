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
exports.Queue = void 0;
var index_js_1 = require("../index.js");
var index_js_2 = require("../oracle/index.js");
var utils_1 = require("@mysten/sui/utils");
var utils_2 = require("@mysten/sui/utils");
var Queue = /** @class */ (function () {
    function Queue(client, address) {
        this.client = client;
        this.address = address;
    }
    /**
     * Create a new Queue
     */
    Queue.initTx = function (client, tx, options) {
        return __awaiter(this, void 0, void 0, function () {
            var switchboardAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.fetchState(options)];
                    case 1:
                        switchboardAddress = (_a.sent()).switchboardAddress;
                        if (options.isGuardianQueue) {
                            tx.moveCall({
                                target: "".concat(switchboardAddress, "::guardian_queue_init_action::run"),
                                arguments: [
                                    tx.pure.vector("u8", Array.from((0, utils_1.fromHex)(options.queueKey))),
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
                                target: "".concat(switchboardAddress, "::oracle_queue_init_action::run"),
                                arguments: [
                                    tx.pure.vector("u8", Array.from((0, utils_1.fromHex)(options.queueKey))),
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
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Queue set configs tx
     */
    Queue.prototype.setConfigsTx = function (tx, options) {
        return __awaiter(this, void 0, void 0, function () {
            var switchboardAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.fetchState(options)];
                    case 1:
                        switchboardAddress = (_a.sent()).switchboardAddress;
                        tx.moveCall({
                            target: "".concat(switchboardAddress, "::queue_set_configs_action::run"),
                            arguments: [
                                tx.object(this.address),
                                tx.pure.string(options.name),
                                tx.pure.u64(options.fee),
                                tx.pure.address(options.feeRecipient),
                                tx.pure.u64(options.minAttestations),
                                tx.pure.u64(options.oracleValidityLengthMs),
                            ],
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Queue set authority tx
     */
    Queue.prototype.setAuthorityTx = function (tx, options) {
        return __awaiter(this, void 0, void 0, function () {
            var switchboardAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.fetchState(options)];
                    case 1:
                        switchboardAddress = (_a.sent()).switchboardAddress;
                        tx.moveCall({
                            target: "".concat(switchboardAddress, "::queue_set_authority_action::run"),
                            arguments: [
                                tx.object(this.address),
                                tx.pure.address(options.newAuthority),
                            ],
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Queue override oracle tx
     */
    Queue.prototype.overrideOracleTx = function (tx, options) {
        return __awaiter(this, void 0, void 0, function () {
            var switchboardAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.fetchState(options)];
                    case 1:
                        switchboardAddress = (_a.sent()).switchboardAddress;
                        tx.moveCall({
                            target: "".concat(switchboardAddress, "::queue_override_oracle_action::run"),
                            arguments: [
                                tx.object(this.address),
                                tx.object(options.oracle),
                                tx.pure.vector("u8", Array.from((0, utils_1.fromHex)(options.secp256k1Key))),
                                tx.pure.vector("u8", Array.from((0, utils_1.fromHex)(options.mrEnclave))),
                                tx.pure.u64(options.expirationTimeMs),
                                tx.object(utils_2.SUI_CLOCK_OBJECT_ID),
                            ],
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Queue add fee type tx
     */
    Queue.prototype.addFeeTypeTx = function (tx, options) {
        return __awaiter(this, void 0, void 0, function () {
            var switchboardAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.fetchState(options)];
                    case 1:
                        switchboardAddress = (_a.sent()).switchboardAddress;
                        tx.moveCall({
                            target: "".concat(switchboardAddress, "::queue_add_fee_type_action::run"),
                            arguments: [tx.object(this.address)],
                            typeArguments: [options.feeType],
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Queue remove fee type tx
     */
    Queue.prototype.removeFeeTypeTx = function (tx, options) {
        return __awaiter(this, void 0, void 0, function () {
            var switchboardAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.fetchState(options)];
                    case 1:
                        switchboardAddress = (_a.sent()).switchboardAddress;
                        tx.moveCall({
                            target: "".concat(switchboardAddress, "::queue_remove_fee_type_action::run"),
                            arguments: [tx.object(this.address)],
                            typeArguments: [options.feeType],
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the queue data object
     */
    Queue.prototype.loadData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rpcResponseData, existingOraclesResponse, existingOraclesObjects, existingOraclesDynamicFields, realExistingOraclesContents, existingOracles, data;
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
                        rpcResponseData = _a.sent();
                        existingOraclesResponse = rpcResponseData.existing_oracles;
                        existingOraclesObjects = [];
                        return [4 /*yield*/, this.client.client.getDynamicFields({
                                parentId: existingOraclesResponse.fields.id.id,
                            })];
                    case 2:
                        existingOraclesDynamicFields = _a.sent();
                        existingOraclesObjects.push.apply(existingOraclesObjects, existingOraclesDynamicFields.data);
                        _a.label = 3;
                    case 3:
                        if (!existingOraclesDynamicFields.hasNextPage) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.client.client.getDynamicFields({
                                parentId: existingOraclesDynamicFields.nextCursor,
                            })];
                    case 4:
                        existingOraclesDynamicFields = _a.sent();
                        existingOraclesObjects.push.apply(existingOraclesObjects, existingOraclesDynamicFields.data);
                        return [3 /*break*/, 3];
                    case 5: return [4 /*yield*/, this.client.client.multiGetObjects({
                            ids: existingOraclesObjects.map(function (o) {
                                return o.objectId;
                            }),
                            options: {
                                showContent: true,
                            },
                        })];
                    case 6:
                        realExistingOraclesContents = _a.sent();
                        existingOracles = realExistingOraclesContents.map(function (o) {
                            var fields = (0, index_js_1.getFieldsFromObject)(o);
                            return {
                                oracleId: index_js_1.ObjectParsingHelper.asString(fields.value.fields.oracle_id),
                                oracleKey: (0, utils_1.toBase58)(index_js_1.ObjectParsingHelper.asUint8Array(fields.value.fields.oracle_key)),
                            };
                        });
                        data = {
                            // get authority address
                            authority: index_js_1.ObjectParsingHelper.asString(rpcResponseData.authority),
                            // get existing oracles (TODO)
                            existingOracles: existingOracles,
                            // get fee number (though encoded as string)
                            fee: index_js_1.ObjectParsingHelper.asNumber(rpcResponseData.fee),
                            // fee recipient address
                            feeRecipient: index_js_1.ObjectParsingHelper.asString(rpcResponseData.fee_recipient),
                            // accepted fee coin types
                            feeTypes: index_js_1.ObjectParsingHelper.asArray(rpcResponseData.fee_types).map(function (ft) { return ft.fields.name; }),
                            // guardian queue id
                            guardianQueueId: index_js_1.ObjectParsingHelper.asString(rpcResponseData.guardian_queue_id),
                            // queue id
                            id: index_js_1.ObjectParsingHelper.asId(rpcResponseData.id),
                            // last queue override ms
                            lastQueueOverrideMs: index_js_1.ObjectParsingHelper.asNumber(rpcResponseData.last_queue_override_ms),
                            // minimum attestations
                            minAttestations: index_js_1.ObjectParsingHelper.asNumber(rpcResponseData.min_attestations),
                            // queue name
                            name: index_js_1.ObjectParsingHelper.asString(rpcResponseData.name),
                            oracleValidityLengthMs: index_js_1.ObjectParsingHelper.asNumber(rpcResponseData.oracle_validity_length_ms),
                            // get source queue key
                            queueKey: (0, utils_1.toBase58)(index_js_1.ObjectParsingHelper.asUint8Array(rpcResponseData.queue_key)),
                        };
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * Load oracle data
     */
    Queue.prototype.loadOracleData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var queueData, oracleIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadData()];
                    case 1:
                        queueData = _a.sent();
                        oracleIds = queueData.existingOracles.map(function (o) { return o.oracleId; });
                        return [2 /*return*/, index_js_2.Oracle.loadMany(this.client, oracleIds)];
                }
            });
        });
    };
    return Queue;
}());
exports.Queue = Queue;
//# sourceMappingURL=index.js.map