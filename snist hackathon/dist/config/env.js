"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
exports.validateEnv = validateEnv;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: zod_1.z.coerce.number().default(5000),
    MONGODB_URI: zod_1.z.string().default("mongodb://localhost:27017/hackforge"),
    GEMINI_API_KEY: zod_1.z.string().default(""),
    GEMINI_MODEL: zod_1.z.string().default("gemini-3.6-flash"),
    GROQ_API_KEY: zod_1.z.string().optional().default(""),
    GROQ_MODEL: zod_1.z.string().optional().default("openai/gpt-oss-20b"),
    TAVILY_API_KEY: zod_1.z.string().default(""),
    GITHUB_TOKEN: zod_1.z.string().default(""),
    DEEPSEEK_API_KEY: zod_1.z.string().default(""),
    DEEPSEEK_BASE_URL: zod_1.z.string().default("https://api.deepseek.com/v1"),
    DEEPSEEK_MODEL: zod_1.z.string().default("deepseek-chat"),
    VECTOR_DB_PROVIDER: zod_1.z.string().optional().default("mongodb"),
    VECTOR_DB_URL: zod_1.z.string().optional().default(""),
    VECTOR_DB_API_KEY: zod_1.z.string().optional().default(""),
});
let _config = null;
function getConfig() {
    if (!_config) {
        const result = envSchema.safeParse(process.env);
        if (!result.success) {
            console.error("Invalid environment variables:", result.error.flatten().fieldErrors);
            _config = envSchema.parse({});
        }
        else {
            _config = result.data;
        }
    }
    return _config;
}
function validateEnv() {
    const config = getConfig();
    console.log(`[ENV] NODE_ENV=${config.NODE_ENV}`);
    console.log(`[ENV] PORT=${config.PORT}`);
    console.log(`[ENV] MONGODB_URI=${config.MONGODB_URI}`);
    console.log(`[ENV] GEMINI_API_KEY=${config.GEMINI_API_KEY ? "SET" : "NOT SET"}`);
    console.log(`[ENV] TAVILY_API_KEY=${config.TAVILY_API_KEY ? "SET" : "NOT SET"}`);
    console.log(`[ENV] GITHUB_TOKEN=${config.GITHUB_TOKEN ? "SET" : "NOT SET"}`);
    console.log(`[ENV] DEEPSEEK_API_KEY=${config.DEEPSEEK_API_KEY ? "SET" : "NOT SET"}`);
    console.log(`[ENV] DEEPSEEK_MODEL=${config.DEEPSEEK_MODEL}`);
}
//# sourceMappingURL=env.js.map