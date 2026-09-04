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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchCache = void 0;
exports.findCachedSearch = findCachedSearch;
exports.cacheSearchResult = cacheSearchResult;
const mongoose_1 = __importStar(require("mongoose"));
const SearchCacheSchema = new mongoose_1.Schema({
    query: { type: String, required: true },
    queryHash: { type: String, required: true, unique: true },
    results: { type: mongoose_1.Schema.Types.Mixed, default: [] },
    geminiResults: { type: mongoose_1.Schema.Types.Mixed, default: [] },
    tavilyResults: { type: mongoose_1.Schema.Types.Mixed, default: [] },
    retrievedAt: { type: Date, default: Date.now },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days TTL
    },
}, {
    timestamps: false,
});
// TTL index for automatic expiration
SearchCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.SearchCache = mongoose_1.default.model("SearchCache", SearchCacheSchema);
async function findCachedSearch(queryHash) {
    try {
        return await exports.SearchCache.findOne({
            queryHash,
            expiresAt: { $gt: new Date() },
        });
    }
    catch (err) {
        console.error("[SearchCache] findCachedSearch error:", err);
        return null;
    }
}
async function cacheSearchResult(query, queryHash, results, geminiResults, tavilyResults) {
    try {
        await exports.SearchCache.findOneAndUpdate({ queryHash }, {
            query,
            queryHash,
            results,
            geminiResults,
            tavilyResults,
            retrievedAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }, { upsert: true });
    }
    catch (err) {
        console.error("[SearchCache] cacheSearchResult error:", err);
    }
}
//# sourceMappingURL=SearchCache.model.js.map