import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().default("mongodb://localhost:27017/hackforge"),
  GEMINI_API_KEY: z.string().default(""),
  GEMINI_MODEL: z.string().default("gemini-flash-lite-latest"),
  GROQ_API_KEY: z.string().optional().default(""),
  GROQ_MODEL: z.string().optional().default("openai/gpt-oss-20b"),
  TAVILY_API_KEY: z.string().default(""),
  GITHUB_TOKEN: z.string().default(""),
  VECTOR_DB_PROVIDER: z.string().optional().default("mongodb"),
  VECTOR_DB_URL: z.string().optional().default(""),
  VECTOR_DB_API_KEY: z.string().optional().default(""),
  JWT_SECRET: z.string().default("hackwave-jwt-secret"),
  EMAIL_USER: z.string().default(""),
  EMAIL_PASS: z.string().default(""),
});

export type EnvConfig = z.infer<typeof envSchema>;

let _config: EnvConfig | null = null;

export function getConfig(): EnvConfig {
  if (!_config) {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
      console.error("Invalid environment variables:", result.error.flatten().fieldErrors);
      _config = envSchema.parse({});
    } else {
      _config = result.data;
    }
  }
  return _config;
}

export function validateEnv(): void {
  const config = getConfig();
  console.log(`[ENV] NODE_ENV=${config.NODE_ENV}`);
  console.log(`[ENV] PORT=${config.PORT}`);
  console.log(`[ENV] MONGODB_URI=${config.MONGODB_URI}`);
  console.log(`[ENV] GEMINI_API_KEY=${config.GEMINI_API_KEY ? "SET" : "NOT SET"}`);
  console.log(`[ENV] TAVILY_API_KEY=${config.TAVILY_API_KEY ? "SET" : "NOT SET"}`);
  console.log(`[ENV] GITHUB_TOKEN=${config.GITHUB_TOKEN ? "SET" : "NOT SET"}`);
  console.log(`[ENV] JWT_SECRET=${config.JWT_SECRET ? "SET" : "NOT SET"}`);
  console.log(`[ENV] EMAIL_USER=${config.EMAIL_USER ? "SET" : "NOT SET"}`);
}
