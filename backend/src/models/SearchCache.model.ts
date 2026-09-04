import mongoose, { Schema, Document } from "mongoose";

export interface ISearchCache extends Document {
  query: string;
  queryHash: string;
  results: any[];
  geminiResults: any[];
  tavilyResults: any[];
  retrievedAt: Date;
  expiresAt: Date;
}

const SearchCacheSchema = new Schema<ISearchCache>(
  {
    query: { type: String, required: true },
    queryHash: { type: String, required: true, unique: true },
    results: { type: Schema.Types.Mixed, default: [] },
    geminiResults: { type: Schema.Types.Mixed, default: [] },
    tavilyResults: { type: Schema.Types.Mixed, default: [] },
    retrievedAt: { type: Date, default: Date.now },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days TTL
    },
  },
  {
    timestamps: false,
  }
);

// TTL index for automatic expiration
SearchCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SearchCache = mongoose.model<ISearchCache>(
  "SearchCache",
  SearchCacheSchema
);

export async function findCachedSearch(queryHash: string): Promise<ISearchCache | null> {
  try {
    return await SearchCache.findOne({
      queryHash,
      expiresAt: { $gt: new Date() },
    });
  } catch (err) {
    console.error("[SearchCache] findCachedSearch error:", err);
    return null;
  }
}

export async function cacheSearchResult(
  query: string,
  queryHash: string,
  results: any[],
  geminiResults: any[],
  tavilyResults: any[]
): Promise<void> {
  try {
    await SearchCache.findOneAndUpdate(
      { queryHash },
      {
        query,
        queryHash,
        results,
        geminiResults,
        tavilyResults,
        retrievedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      { upsert: true }
    );
  } catch (err) {
    console.error("[SearchCache] cacheSearchResult error:", err);
  }
}
