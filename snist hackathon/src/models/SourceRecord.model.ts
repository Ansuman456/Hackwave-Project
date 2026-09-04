import mongoose, { Schema, Document } from "mongoose";

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

const SourceRecordSchema = new Schema<ISourceRecord>(
  {
    canonicalUrl: { type: String, required: true, unique: true },
    title: { type: String, default: "" },
    domain: { type: String, default: "" },
    sourceType: { type: String, default: "web" },
    contentHash: { type: String, required: true },
    content: { type: String, default: "" },
    snippet: { type: String, default: "" },
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
SourceRecordSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Fast lookup by canonical URL
SourceRecordSchema.index({ canonicalUrl: 1 });

export const SourceRecord = mongoose.model<ISourceRecord>(
  "SourceRecord",
  SourceRecordSchema
);

export async function findCachedSource(
  canonicalUrl: string
): Promise<ISourceRecord | null> {
  try {
    return await SourceRecord.findOne({
      canonicalUrl,
      expiresAt: { $gt: new Date() },
    });
  } catch (err) {
    console.error("[SourceRecord] findCachedSource error:", err);
    return null;
  }
}

export async function cacheSource(
  canonicalUrl: string,
  title: string,
  domain: string,
  sourceType: string,
  contentHash: string,
  content: string,
  snippet: string
): Promise<void> {
  try {
    await SourceRecord.findOneAndUpdate(
      { canonicalUrl },
      {
        title,
        domain,
        sourceType,
        contentHash,
        content,
        snippet,
        retrievedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      { upsert: true }
    );
  } catch (err) {
    console.error("[SourceRecord] cacheSource error:", err);
  }
}
