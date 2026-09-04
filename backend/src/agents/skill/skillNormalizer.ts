import { SkillNode } from "../../graph/state";

// Canonical skill names and their categories. Used to normalize variants
// (ReactJS -> React, Node.js -> Node.js) and to classify skills for task
// matching.
const SKILL_CATALOG: Record<string, string> = {
  react: "frontend",
  reactjs: "frontend",
  "react.js": "frontend",
  "next.js": "frontend",
  nextjs: "frontend",
  vue: "frontend",
  vuejs: "frontend",
  angular: "frontend",
  svelte: "frontend",
  "tailwind css": "frontend",
  tailwind: "frontend",
  css: "frontend",
  html: "frontend",
  javascript: "frontend",
  typescript: "frontend",
  redux: "frontend",

  node: "backend",
  "node.js": "backend",
  nodejs: "backend",
  express: "backend",
  "express.js": "backend",
  nestjs: "backend",
  django: "backend",
  flask: "backend",
  fastapi: "backend",
  spring: "backend",
  "spring boot": "backend",
  "go": "backend",
  golang: "backend",
  rust: "backend",
  "c#": "backend",
  ".net": "backend",
  java: "backend",
  "rest api": "backend",
  graphql: "backend",
  websocket: "backend",
  socketio: "backend",
  "socket.io": "backend",
  "authentication": "backend",

  mongodb: "database",
  postgresql: "database",
  postgres: "database",
  mysql: "database",
  sqlite: "database",
  redis: "database",
  sql: "database",
  firebase: "database",
  supabase: "database",
  "database design": "database",
  prisma: "database",
  "typeorm": "database",
  mongoose: "database",

  python: "ai",
  pytorch: "ai",
  tensorflow: "ai",
  "scikit-learn": "ai",
  sklearn: "ai",
  langchain: "ai",
  langgraph: "ai",
  "hugging face": "ai",
  transformers: "ai",
  rag: "ai",
  "retrieval augmented generation": "ai",
  "vector database": "ai",
  embeddings: "ai",
  "openai api": "ai",
  "openai": "ai",
  llm: "ai",
  "agent orchestration": "ai",
  "prompt engineering": "ai",
  "fine-tuning": "ai",
  "machine learning": "ml",
  ml: "ml",
  "deep learning": "ml",
  nlp: "ml",
  "computer vision": "ml",

  docker: "devops",
  kubernetes: "devops",
  aws: "devops",
  gcp: "devops",
  azure: "devops",
  "google cloud": "devops",
  vercel: "devops",
  netlify: "devops",
  "ci/cd": "devops",
  "github actions": "devops",
  terraform: "devops",
  jenkins: "devops",
  linux: "devops",
  git: "general",
  bash: "devops",
  deployment: "devops",

  "react native": "mobile",
  flutter: "mobile",
  swift: "mobile",
  kotlin: "mobile",

  figma: "design",
  "ui/ux": "design",
  "ux design": "design",
  "ui design": "design",
  "user interface": "design",

  jest: "testing",
  pytest: "testing",
  "unit testing": "testing",
  testing: "testing",
  "end-to-end testing": "testing",
  "e2e": "testing",
};

const ALIASES: Record<string, string> = {
  reactjs: "react",
  "react.js": "react",
  nextjs: "next.js",
  vuejs: "vue",
  nodejs: "node.js",
  node: "node.js",
  "express.js": "express",
  golang: "go",
  postgres: "postgresql",
  sklearn: "scikit-learn",
  socketio: "socket.io",
  "retrieval augmented generation": "rag",
};

export function normalizeSkill(skill: string): string {
  const cleaned = skill.toLowerCase().trim().replace(/[^a-z0-9.#/+ -]/g, "");
  if (!cleaned) return "";
  return ALIASES[cleaned] || cleaned;
}

export function skillCategory(skill: string): SkillNode["category"] {
  const normalized = normalizeSkill(skill);
  return (SKILL_CATALOG[normalized] as SkillNode["category"]) || "other";
}

export function isTechnologySkill(skill: string): boolean {
  const c = skillCategory(skill);
  return c !== "other" && c !== "general";
}
