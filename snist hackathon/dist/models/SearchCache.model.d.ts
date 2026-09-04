import mongoose, { Document } from "mongoose";
export interface ISearchCache extends Document {
    query: string;
    queryHash: string;
    results: any[];
    geminiResults: any[];
    tavilyResults: any[];
    retrievedAt: Date;
    expiresAt: Date;
}
export declare const SearchCache: mongoose.Model<ISearchCache, {}, {}, {}, mongoose.Document<unknown, {}, ISearchCache, {}, {}> & ISearchCache & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare function findCachedSearch(queryHash: string): Promise<ISearchCache | null>;
export declare function cacheSearchResult(query: string, queryHash: string, results: any[], geminiResults: any[], tavilyResults: any[]): Promise<void>;
//# sourceMappingURL=SearchCache.model.d.ts.map