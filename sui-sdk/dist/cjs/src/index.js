"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectParsingHelper = exports.SwitchboardClient = exports.solanaProgramCache = exports.suiQueueCache = exports.ON_DEMAND_TESTNET_STATE_OBJECT_ID = exports.ON_DEMAND_TESTNET_OBJECT_PACKAGE_ID = exports.ON_DEMAND_MAINNET_STATE_OBJECT_ID = exports.ON_DEMAND_MAINNET_OBJECT_PACKAGE_ID = exports.State = exports.Queue = exports.Oracle = void 0;
exports.getSwitchboardState = getSwitchboardState;
exports.getFieldsFromObject = getFieldsFromObject;
var index_js_1 = require("./oracle/index.js");
Object.defineProperty(exports, "Oracle", { enumerable: true, get: function () { return index_js_1.Oracle; } });
var index_js_2 = require("./queue/index.js");
Object.defineProperty(exports, "Queue", { enumerable: true, get: function () { return index_js_2.Queue; } });
var index_js_3 = require("./state/index.js");
Object.defineProperty(exports, "State", { enumerable: true, get: function () { return index_js_3.State; } });
var ttlcache_1 = require("@brokerloop/ttlcache");
var bn_js_1 = __importDefault(require("bn.js"));
__exportStar(require("./aggregator/index.js"), exports);
__exportStar(require("./oracle/index.js"), exports);
__exportStar(require("./queue/index.js"), exports);
__exportStar(require("./state/index.js"), exports);
__exportStar(require("@switchboard-xyz/on-demand"), exports);
exports.ON_DEMAND_MAINNET_OBJECT_PACKAGE_ID = "0xc3c7e6eb7202e9fb0389a2f7542b91cc40e4f7a33c02554fec11c4c92f938ea3";
exports.ON_DEMAND_MAINNET_STATE_OBJECT_ID = "0x93d2a8222bb2006d16285ac858ec2ae5f644851917504b94debde8032664a791";
exports.ON_DEMAND_TESTNET_OBJECT_PACKAGE_ID = "0xdd96e1c8d6d61c4642b9b73eefb1021cc5f93f489b794bca11c81d55fcf43ce2";
exports.ON_DEMAND_TESTNET_STATE_OBJECT_ID = "0x2086fdde07a8f4726a3fc72d6ef1021343a781d42de6541ca412cf50b4339ad6";
// ==============================================================================
// Caching for Fetch Update Ix
// 1 min cache for sui cache
exports.suiQueueCache = new ttlcache_1.TTLCache({
    ttl: 1000 * 60,
});
// 5 min solana queue cache - reloads the sol program every 5 minutes max
exports.solanaProgramCache = new ttlcache_1.TTLCache({
    ttl: 1000 * 60 * 5,
});
var SwitchboardClient = /** @class */ (function () {
    function SwitchboardClient(client, options) {
        this.client = client;
        this.state = getSwitchboardState(client, options);
    }
    /**
     * Fetch the current state of the Switchboard (on-demand package ID, guardian queue ID, oracle queue ID)
     * @param retries Number of retries to fetch the state
     */
    SwitchboardClient.prototype.fetchState = function (options_1) {
        return __awaiter(this, arguments, void 0, function (options, retries) {
            var state, error_1;
            var _a, _b, _c;
            if (retries === void 0) { retries = 3; }
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (retries <= 0) {
                            throw new Error("Failed to fetch Switchboard state after multiple attempts");
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.state];
                    case 2:
                        state = _d.sent();
                        if (!state) {
                            this.state = getSwitchboardState(this.client, options);
                            return [2 /*return*/, this.fetchState(options, retries - 1)];
                        }
                        return [2 /*return*/, {
                                switchboardAddress: (_a = options === null || options === void 0 ? void 0 : options.switchboardAddress) !== null && _a !== void 0 ? _a : state.switchboardAddress,
                                guardianQueueId: (_b = options === null || options === void 0 ? void 0 : options.guardianQueueId) !== null && _b !== void 0 ? _b : state.guardianQueueId,
                                oracleQueueId: (_c = options === null || options === void 0 ? void 0 : options.oracleQueueId) !== null && _c !== void 0 ? _c : state.oracleQueueId,
                                mainnet: state.mainnet,
                            }];
                    case 3:
                        error_1 = _d.sent();
                        console.error("Error fetching Switchboard state, retrying...");
                        return [2 /*return*/, this.fetchState(options, retries - 1)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return SwitchboardClient;
}());
exports.SwitchboardClient = SwitchboardClient;
// Helper function to get the Switchboard state
function getSwitchboardState(client, options) {
    return __awaiter(this, void 0, void 0, function () {
        var chainId, _a, mainnet, stateObjectId, data, error_2;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 5, , 6]);
                    if (!((_b = options === null || options === void 0 ? void 0 : options.chainId) !== null && _b !== void 0)) return [3 /*break*/, 1];
                    _a = _b;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, client.getChainIdentifier()];
                case 2:
                    _a = (_g.sent());
                    _g.label = 3;
                case 3:
                    chainId = _a;
                    mainnet = chainId !== "4c78adac";
                    console.log("Chain ID:", chainId);
                    console.log("Mainnet:", mainnet);
                    console.log("Options:", options);
                    stateObjectId = (_c = options === null || options === void 0 ? void 0 : options.stateObjectId) !== null && _c !== void 0 ? _c : (mainnet ? exports.ON_DEMAND_MAINNET_STATE_OBJECT_ID : exports.ON_DEMAND_TESTNET_STATE_OBJECT_ID);
                    console.log("State Object ID:", stateObjectId);
                    return [4 /*yield*/, index_js_3.State.fetch(client, stateObjectId)];
                case 4:
                    data = _g.sent();
                    return [2 /*return*/, {
                            switchboardAddress: (_d = options === null || options === void 0 ? void 0 : options.switchboardAddress) !== null && _d !== void 0 ? _d : data.onDemandPackageId,
                            guardianQueueId: (_e = options === null || options === void 0 ? void 0 : options.guardianQueueId) !== null && _e !== void 0 ? _e : data.guardianQueue,
                            oracleQueueId: (_f = options === null || options === void 0 ? void 0 : options.oracleQueueId) !== null && _f !== void 0 ? _f : data.oracleQueue,
                            mainnet: mainnet,
                        }];
                case 5:
                    error_2 = _g.sent();
                    console.error("Failed to retrieve Switchboard state:", error_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function getFieldsFromObject(response) {
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
var ObjectParsingHelper = /** @class */ (function () {
    function ObjectParsingHelper() {
    }
    ObjectParsingHelper.asString = function (value) {
        if (typeof value === "string") {
            return value;
        }
        throw new Error("Invalid Move String");
    };
    ObjectParsingHelper.asNumber = function (value) {
        try {
            return parseInt(value);
        }
        catch (e) {
            throw new Error("Invalid Move Number");
        }
    };
    ObjectParsingHelper.asArray = function (value) {
        if (Array.isArray(value)) {
            return value;
        }
        throw new Error("Invalid MoveValueArray");
    };
    ObjectParsingHelper.asUint8Array = function (value) {
        if (Array.isArray(value) && value.every(function (v) { return typeof v === "number"; })) {
            return new Uint8Array(value);
        }
        throw new Error("Invalid Move Uint8Array");
    };
    ObjectParsingHelper.asId = function (value) {
        if (typeof value === "object" && "id" in value) {
            var idWrapper = value;
            return idWrapper.id;
        }
        throw new Error("Invalid Move Id");
    };
    ObjectParsingHelper.asStruct = function (value) {
        if (typeof value === "object" && !Array.isArray(value)) {
            return value;
        }
        throw new Error("Invalid Move Struct");
    };
    // Parse switchboard move decimal into BN, whether or not nested in "fields"
    ObjectParsingHelper.asBN = function (value) {
        if (typeof value !== "object") {
            throw new Error("Invalid Move BN Input Type");
        }
        var target = "fields" in value ? value.fields : value;
        if (typeof target === "object" && "value" in target && "neg" in target) {
            return new bn_js_1.default(target.value.toString()).mul(target.neg ? new bn_js_1.default(-1) : new bn_js_1.default(1));
        }
        throw new Error("Invalid Move BN");
    };
    return ObjectParsingHelper;
}());
exports.ObjectParsingHelper = ObjectParsingHelper;
//# sourceMappingURL=index.js.map