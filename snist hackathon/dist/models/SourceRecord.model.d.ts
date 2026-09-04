import mongoose, { Document } from "mongoose";
export interface ISourceRecord extends Document {
    canonicalUrl: string;
    title: string;
    domain: string;
    sourceType: string;
    contentHash: string;
    content: string;
    snippet: string;
    retrievedAt: Date;
    expiresAt: Date;
}
export declare const SourceRecord: mongoose.Model<ISourceRecord, {}, {}, {}, mongoose.Document<unknown, {}, ISourceRecord, {}, {}> & ISourceRecord & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare function findCachedSource(canonicalUrl: string): Promise<ISourceRecord | null>;
export declare function cacheSource(canonicalUrl: string, title: string, domain: string, sourceType: string, contentHash: string, content: string, snippet: string): Promise<void>;
//# sourceMappingURL=SourceRecord.model.d.ts.map