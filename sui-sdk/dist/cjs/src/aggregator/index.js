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
exports.Aggregator = void 0;
var index_js_1 = require("../index.js");
var _2024_4_1 = require("@mysten/sui/graphql/schemas/2024.4");
var utils_1 = require("@mysten/sui/utils");
var common_1 = require("@switchboard-xyz/common");
var on_demand_1 = require("@switchboard-xyz/on-demand");
var Aggregator = /** @class */ (function () {
    function Aggregator(client, address) {
        this.client = client;
        this.address = address;
    }
    /**
     * Create a new Aggregator
     * @param client - SuiClient
     * @param tx - Transaction
     * @param options - AggregatorInitParams
     * @constructor
     */
    Aggregator.initTx = function (client, tx, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, switchboardAddress, oracleQueueId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, client.fetchState(options)];
                    case 1:
                        _a = _b.sent(), switchboardAddress = _a.switchboardAddress, oracleQueueId = _a.oracleQueueId;
                        tx.moveCall({
                            target: "".concat(switchboardAddress, "::aggregator_init_action::run"),
                            arguments: [
                                tx.object(oracleQueueId),
                                tx.pure.address(options.authority),
                                tx.pure.string(options.name),
                                tx.pure.vector("u8", Array.from((0, utils_1.fromHex)(options.feedHash))),
                                tx.pure.u64(options.minSampleSize),
                                tx.pure.u64(options.maxStalenessSeconds),
                                tx.pure.u64(options.maxVariance),
                                tx.pure.u32(options.minResponses),
                                tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
                            ],
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set configs for the Aggregator
     * @param tx - Transaction
     * @param options - AggregatorConfigParams
     */
    Aggregator.prototype.setConfigsTx = function (tx, options) {
        return __awaiter(this, void 0, void 0, function () {
            var switchboardAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.fetchState(options)];
                    case 1:
                        switchboardAddress = (_a.sent()).switchboardAddress;
                        tx.moveCall({
                            target: "".concat(switchboardAddress, "::aggregator_set_configs_action::run"),
                            arguments: [
                                tx.object(this.address),
                                tx.pure.vector("u8", Array.from((0, utils_1.fromHex)(options.feedHash))),
                                tx.pure.u64(options.minSampleSize),
                                tx.pure.u64(options.maxStalenessSeconds),
                                tx.pure.u64(options.maxVariance),
                                tx.pure.u32(options.minResponses),
                            ],
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set the feed authority
     * @param tx - Transaction
     * @param options - AggregatorSetAuthorityParams
     */
    Aggregator.prototype.setAuthorityTx = function (tx, options) {
        return __awaiter(this, void 0, void 0, function () {
            var switchboardAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.fetchState(options)];
                    case 1:
                        switchboardAddress = (_a.sent()).switchboardAddress;
                        tx.moveCall({
                            target: "".concat(switchboardAddress, "::aggregator_set_authority_action::run"),
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
     * Pull feed tx
     * @param tx - Transaction
     * @param options - CommonOptions
     */
    Aggregator.prototype.fetchUpdateTx = function (tx, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, switchboardAddress, oracleQueueId, feedConfigs, aggregatorData, suiQueue, queue, solanaQueue, crossbarClient, jobs, _b, responses, failures, validOracles, validResponses, coins;
            var _this = this;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.client.fetchState(options)];
                    case 1:
                        _a = _e.sent(), switchboardAddress = _a.switchboardAddress, oracleQueueId = _a.oracleQueueId;
                        feedConfigs = options === null || options === void 0 ? void 0 : options.feedConfigs;
                        if (!!feedConfigs) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.loadData()];
                    case 2:
                        aggregatorData = _e.sent();
                        feedConfigs = {
                            minSampleSize: aggregatorData.minSampleSize,
                            feedHash: aggregatorData.feedHash,
                            maxVariance: aggregatorData.maxVariance,
                            minResponses: aggregatorData.minResponses,
                        };
                        _e.label = 3;
                    case 3:
                        suiQueue = index_js_1.suiQueueCache.get(oracleQueueId);
                        if (!!suiQueue) return [3 /*break*/, 5];
                        return [4 /*yield*/, new index_js_1.Queue(this.client, oracleQueueId).loadData()];
                    case 4:
                        queue = _e.sent();
                        index_js_1.suiQueueCache.set(oracleQueueId, queue);
                        suiQueue = queue;
                        _e.label = 5;
                    case 5:
                        if (!(suiQueue.queueKey === on_demand_1.ON_DEMAND_MAINNET_QUEUE.toBase58())) return [3 /*break*/, 8];
                        solanaQueue = index_js_1.solanaProgramCache.get(on_demand_1.ON_DEMAND_MAINNET_QUEUE.toBase58());
                        if (!!solanaQueue) return [3 /*break*/, 7];
                        return [4 /*yield*/, (0, on_demand_1.getDefaultQueue)(options === null || options === void 0 ? void 0 : options.solanaRPCUrl)];
                    case 6:
                        solanaQueue = _e.sent();
                        index_js_1.solanaProgramCache.set(on_demand_1.ON_DEMAND_MAINNET_QUEUE.toBase58(), solanaQueue);
                        _e.label = 7;
                    case 7: return [3 /*break*/, 12];
                    case 8:
                        if (!(suiQueue.queueKey === on_demand_1.ON_DEMAND_DEVNET_QUEUE.toBase58())) return [3 /*break*/, 11];
                        solanaQueue = index_js_1.solanaProgramCache.get(on_demand_1.ON_DEMAND_DEVNET_QUEUE.toBase58());
                        if (!!solanaQueue) return [3 /*break*/, 10];
                        return [4 /*yield*/, (0, on_demand_1.getDefaultDevnetQueue)(options === null || options === void 0 ? void 0 : options.solanaRPCUrl)];
                    case 9:
                        solanaQueue = _e.sent();
                        index_js_1.solanaProgramCache.set(on_demand_1.ON_DEMAND_DEVNET_QUEUE.toBase58(), solanaQueue);
                        _e.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11: throw new Error("[fetchUpdateTx]: QUEUE NOT FOUND");
                    case 12:
                        // fail out if we can't load the queue
                        if (!solanaQueue) {
                            throw new Error("Could not load the Switchboard Queue - Queue pubkey: ".concat(suiQueue.queueKey));
                        }
                        crossbarClient = (_c = options === null || options === void 0 ? void 0 : options.crossbarClient) !== null && _c !== void 0 ? _c : new common_1.CrossbarClient((_d = options === null || options === void 0 ? void 0 : options.crossbarUrl) !== null && _d !== void 0 ? _d : "https://crossbar.switchboard.xyz");
                        return [4 /*yield*/, crossbarClient
                                .fetch(feedConfigs.feedHash)
                                .then(function (res) { return res.jobs.map(function (job) { return common_1.OracleJob.fromObject(job); }); })];
                    case 13:
                        jobs = _e.sent();
                        return [4 /*yield*/, solanaQueue.fetchSignatures({
                                jobs: jobs,
                                // Make this more granular in the canonical fetch signatures (within @switchboard-xyz/on-demand)
                                maxVariance: Math.floor(feedConfigs.maxVariance / 1e9),
                                minResponses: feedConfigs.minResponses,
                                numSignatures: feedConfigs.minSampleSize,
                                // blockhash checks aren't possible yet on SUI
                                recentHash: (0, utils_1.toBase58)(new Uint8Array(32)),
                                useTimestamp: true,
                            })];
                    case 14:
                        _b = _e.sent(), responses = _b.responses, failures = _b.failures;
                        validOracles = new Set(suiQueue.existingOracles.map(function (o) { return o.oracleKey; }));
                        validResponses = responses.filter(function (r) {
                            return validOracles.has((0, utils_1.toBase58)((0, utils_1.fromHex)(r.oracle_pubkey)));
                        });
                        // if we have no valid responses (or not enough), fail out
                        if (!validResponses.length ||
                            validResponses.length < feedConfigs.minSampleSize) {
                            // maybe retry by recursing into the same function / add a retry count
                            throw new Error("Not enough valid oracle responses.");
                        }
                        coins = tx.splitCoins(tx.gas, validResponses.map(function () { return suiQueue.fee; }));
                        // map the responses into the tx
                        validResponses.forEach(function (response, i) {
                            var oracle = suiQueue.existingOracles.find(function (o) { return o.oracleKey === (0, utils_1.toBase58)((0, utils_1.fromHex)(response.oracle_pubkey)); });
                            var signature = Array.from((0, utils_1.fromBase64)(response.signature));
                            signature.push(response.recovery_id);
                            tx.moveCall({
                                target: "".concat(switchboardAddress, "::aggregator_submit_result_action::run"),
                                arguments: [
                                    tx.object(_this.address),
                                    tx.object(suiQueue.id),
                                    tx.pure.u128(response.success_value),
                                    tx.pure.bool(response.success_value.startsWith("-")),
                                    tx.pure.u64(response.timestamp),
                                    tx.object(oracle.oracleId),
                                    tx.pure.vector("u8", signature),
                                    tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
                                    coins[i],
                                ],
                                typeArguments: [utils_1.SUI_TYPE_ARG],
                            });
                        });
                        return [2 /*return*/, { responses: responses, failures: failures }];
                }
            });
        });
    };
    /**
     * Get the feed data object
     */
    Aggregator.prototype.loadData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var aggregatorData, currentResult, updateState, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.client
                            .getObject({
                            id: this.address,
                            options: {
                                showContent: true,
                                showType: false,
                            },
                        })
                            .then(index_js_1.getFieldsFromObject)];
                    case 1:
                        aggregatorData = _a.sent();
                        currentResult = aggregatorData.current_result.fields;
                        updateState = aggregatorData.update_state.fields;
                        data = {
                            id: index_js_1.ObjectParsingHelper.asId(aggregatorData.id),
                            authority: index_js_1.ObjectParsingHelper.asString(aggregatorData.authority),
                            createdAtMs: index_js_1.ObjectParsingHelper.asNumber(aggregatorData.created_at_ms),
                            currentResult: {
                                maxResult: index_js_1.ObjectParsingHelper.asBN(currentResult.max_result),
                                maxTimestamp: index_js_1.ObjectParsingHelper.asNumber(currentResult.max_timestamp_ms),
                                mean: index_js_1.ObjectParsingHelper.asBN(currentResult.mean),
                                minResult: index_js_1.ObjectParsingHelper.asBN(currentResult.min_result),
                                minTimestamp: index_js_1.ObjectParsingHelper.asNumber(currentResult.min_timestamp_ms),
                                range: index_js_1.ObjectParsingHelper.asBN(currentResult.range),
                                result: index_js_1.ObjectParsingHelper.asBN(currentResult.result),
                                stdev: index_js_1.ObjectParsingHelper.asBN(currentResult.stdev),
                            },
                            feedHash: (0, utils_1.toHex)(index_js_1.ObjectParsingHelper.asUint8Array(aggregatorData.feed_hash)),
                            maxStalenessSeconds: index_js_1.ObjectParsingHelper.asNumber(aggregatorData.max_staleness_seconds),
                            maxVariance: index_js_1.ObjectParsingHelper.asNumber(aggregatorData.max_variance),
                            minResponses: index_js_1.ObjectParsingHelper.asNumber(aggregatorData.min_responses),
                            minSampleSize: index_js_1.ObjectParsingHelper.asNumber(aggregatorData.min_sample_size),
                            name: index_js_1.ObjectParsingHelper.asString(aggregatorData.name),
                            queue: index_js_1.ObjectParsingHelper.asString(aggregatorData.queue),
                            updateState: {
                                currIdx: index_js_1.ObjectParsingHelper.asNumber(updateState.curr_idx),
                                results: updateState.results.map(function (r) {
                                    var oracleId = r.fields.oracle;
                                    var value = index_js_1.ObjectParsingHelper.asBN(r.fields.result.fields);
                                    var timestamp = parseInt(r.fields.timestamp_ms);
                                    return {
                                        oracle: oracleId,
                                        value: value,
                                        timestamp: timestamp,
                                    };
                                }),
                            },
                        };
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * Load all feeds
     */
    Aggregator.loadAllFeeds = function (graphqlClient, switchboardAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var query, parseAggregator, fetchAggregators;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = (0, _2024_4_1.graphql)("\n      query($cursor: String) {\n        objects(\n          first: 50,\n          after: $cursor,\n          filter: {\n            type: \"".concat(switchboardAddress, "::aggregator::Aggregator\"\n          }\n        ) {\n          nodes {\n            address\n            digest\n            asMoveObject {\n              contents {\n                json\n              }\n            }\n          }\n          pageInfo {\n            hasNextPage\n            endCursor\n          }\n        }\n      }\n    "));
                        parseAggregator = function (moveObject) {
                            return {
                                id: moveObject.id,
                                authority: moveObject.authority,
                                createdAtMs: index_js_1.ObjectParsingHelper.asNumber(moveObject.created_at_ms),
                                currentResult: {
                                    maxResult: index_js_1.ObjectParsingHelper.asBN(moveObject.current_result.max_result),
                                    maxTimestamp: index_js_1.ObjectParsingHelper.asNumber(moveObject.current_result.max_timestamp_ms),
                                    mean: index_js_1.ObjectParsingHelper.asBN(moveObject.current_result.mean),
                                    minResult: index_js_1.ObjectParsingHelper.asBN(moveObject.current_result.min_result),
                                    minTimestamp: index_js_1.ObjectParsingHelper.asNumber(moveObject.current_result.min_timestamp_ms),
                                    range: index_js_1.ObjectParsingHelper.asBN(moveObject.current_result.range),
                                    result: index_js_1.ObjectParsingHelper.asBN(moveObject.current_result.result),
                                    stdev: index_js_1.ObjectParsingHelper.asBN(moveObject.current_result.stdev),
                                },
                                feedHash: (0, utils_1.toHex)(index_js_1.ObjectParsingHelper.asUint8Array(moveObject.feed_hash)),
                                maxStalenessSeconds: index_js_1.ObjectParsingHelper.asNumber(moveObject.max_staleness_seconds),
                                maxVariance: index_js_1.ObjectParsingHelper.asNumber(moveObject.max_variance),
                                minResponses: index_js_1.ObjectParsingHelper.asNumber(moveObject.min_responses),
                                minSampleSize: index_js_1.ObjectParsingHelper.asNumber(moveObject.min_sample_size),
                                name: index_js_1.ObjectParsingHelper.asString(moveObject.name),
                                queue: index_js_1.ObjectParsingHelper.asString(moveObject.queue),
                                updateState: {
                                    currIdx: index_js_1.ObjectParsingHelper.asNumber(moveObject.update_state.curr_idx),
                                    results: moveObject.update_state.results.map(function (r) {
                                        var oracleId = r.oracle;
                                        var value = index_js_1.ObjectParsingHelper.asBN(r.result);
                                        var timestamp = parseInt(r.timestamp_ms);
                                        return {
                                            oracle: oracleId,
                                            value: value,
                                            timestamp: timestamp,
                                        };
                                    }),
                                },
                            };
                        };
                        fetchAggregators = function (cursor) { return __awaiter(_this, void 0, void 0, function () {
                            var results, aggregators, hasNextPage, endCursor, _a, _b, _c;
                            var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                            return __generator(this, function (_r) {
                                switch (_r.label) {
                                    case 0: return [4 /*yield*/, graphqlClient.query({
                                            query: query,
                                            variables: { cursor: cursor },
                                        })];
                                    case 1:
                                        results = _r.sent();
                                        aggregators = (_g = (_f = (_e = (_d = results.data) === null || _d === void 0 ? void 0 : _d.objects) === null || _e === void 0 ? void 0 : _e.nodes) === null || _f === void 0 ? void 0 : _f.map(function (result) {
                                            var moveObject = result.asMoveObject.contents.json;
                                            // build the data object from moveObject which looks like the above json
                                            return parseAggregator(moveObject);
                                        })) !== null && _g !== void 0 ? _g : [];
                                        hasNextPage = (_l = (_k = (_j = (_h = results.data) === null || _h === void 0 ? void 0 : _h.objects) === null || _j === void 0 ? void 0 : _j.pageInfo) === null || _k === void 0 ? void 0 : _k.hasNextPage) !== null && _l !== void 0 ? _l : false;
                                        endCursor = (_q = (_p = (_o = (_m = results.data) === null || _m === void 0 ? void 0 : _m.objects) === null || _o === void 0 ? void 0 : _o.pageInfo) === null || _p === void 0 ? void 0 : _p.endCursor) !== null && _q !== void 0 ? _q : null;
                                        if (!hasNextPage) return [3 /*break*/, 3];
                                        _b = (_a = aggregators.push).apply;
                                        _c = [aggregators];
                                        return [4 /*yield*/, fetchAggregators(endCursor)];
                                    case 2:
                                        _b.apply(_a, _c.concat([(_r.sent())]));
                                        _r.label = 3;
                                    case 3: 
                                    // Return the list of aggregators.
                                    return [2 /*return*/, aggregators];
                                }
                            });
                        }); };
                        return [4 /*yield*/, fetchAggregators(null)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Aggregator;
}());
exports.Aggregator = Aggregator;
//# sourceMappingURL=index.js.map