import mongoose, { Schema, Document } from "mongoose";

export interface IGitHubProfileCache extends Document {
  username: string;
  profile: any;
  repos: any[];
  repoDetails: Record<string, any>;
  retrievedAt: Date;
  expiresAt: Date;
}

const GitHubProfileCacheSchema = new Schema<IGitHubProfileCache>(
  {
    username: { type: String, required: true, unique: true },
    profile: { type: Schema.Types.Mixed, default: null },
    repos: { type: Schema.Types.Mixed, default: [] },
    repoDetails: { type: Schema.Types.Mixed, default: {} },
    retrievedAt: { type: Date, default: Date.now },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: false }
);

GitHubProfileCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const GitHubProfileCache = mongoose.model<IGitHubProfileCache>(
  "GitHubProfileCache",
  GitHubProfileCacheSchema
);

export async function findCachedGitHubProfile(
  username: string
): Promise<IGitHubProfileCache | null> {
  try {
    return await GitHubProfileCache.findOne({
      username,
      expiresAt: { $gt: new Date() },
    });
  } catch (err) {
    console.error("[GitHubProfileCache] find error:", err);
    return null;
  }
}

export async function cacheGitHubProfile(
  username: string,
  profile: any,
  repos: any[],
  repoDetails: Record<string, any>
): Promise<void> {
  try {
    await GitHubProfileCache.findOneAndUpdate(
      { username },
      {
        username,
        profile,
        repos,
        repoDetails,
        retrievedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      { upsert: true }
    );
  } catch (err) {
    console.error("[GitHubProfileCache] cache error:", err);
  }
}
