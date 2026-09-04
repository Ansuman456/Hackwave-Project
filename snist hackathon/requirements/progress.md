# HackForge Multi-Agent Platform: Comprehensive Progress & Project Context

## 1. Project Overview
**HackForge** is an autonomous multi-agent platform designed to systematically solve complex hackathon challenges, analyze problem domains, explore global competitive landscapes, and generate innovative hackathon-winning project proposals.

The system is built on **LangGraph.js**, **Express.js**, **TypeScript**, **MongoDB Atlas**, **Gemini API**, **Tavily Search**, and **GitHub REST API**.

---

## 2. Architecture & Technology Stack

```
                     ┌─────────────────────────────────────────────────┐
                     │            Express API / Controllers            │
                     └────────────────────────┬────────────────────────┘
                                              │
                                              ▼
                     ┌─────────────────────────────────────────────────┐
                     │         LangGraph.js Orchestrator Graph         │
                     └───────┬─────────────────────────────────┬───────┘
                             │                                 │
                             ▼                                 ▼
              ┌─────────────────────────────┐   ┌─────────────────────────────┐
              │      Agent 1: Strategist    │   │      Agent 2: Researcher    │
              │       (Gemini API)          │   │  (Gemini + Tavily + GitHub) │
              └──────────────┬──────────────┘   └──────────────┬──────────────┘
                             │                                 │
                             ▼                                 ▼
              ┌─────────────────────────────┐   ┌─────────────────────────────┐
              │   Problem Analysis Schema   │   │  Single-Pass Extraction &   │
              │  (10 Questions, 7 Dims,     │   │  Enrichment Loop            │
              │   2-3 Queries/Source)       │   │  (15 Complete Solutions)    │
              └─────────────────────────────┘   └──────────────┬──────────────┘
                                                               │
                                                               ▼
                                                ┌─────────────────────────────┐
                                                │    Agent 3: Innovation      │
                                                │       (Gemini API)          │
                                                └─────────────────────────────┘
```

### Core Technologies & AI Routing
- **Backend Framework**: Node.js, TypeScript, Express.js
- **State Orchestration**: LangGraph.js State Graph
- **Database**: MongoDB Atlas using Mongoose ODM
- **LLM Infrastructure (`src/utils/llmFactory.ts`)**:
  - **All 3 Agents (Strategist, Researcher, Innovation)** use **Gemini API** (`gemini-flash-lite-latest`) via `@langchain/google-genai`.
  - Gemini provides massive context windows, structured output capabilities, and zero rate limit bottlenecks.
- **Search & Tools (Exclusive to Agent 2)**:
  - **Tavily Search API**: Exclusive web search engine for Agent 2 (Researcher).
  - **Gemini Search Grounding**: Dual web search fallback tool.
  - **GitHub REST API**: Repository code search and metadata extraction.

---

## 3. Agents & Execution Flow

### Agent 1: Strategist Agent
- **LLM**: Gemini API (`gemini-flash-lite-latest`).
- **Purpose**: Deconstructs raw user hackathon problem statements into a structured, research-ready problem model.
- **Output Schema**:
  - `coreProblem`: Specific problem statement.
  - `domainKeywords`: Minimum 8 domain keywords.
  - `researchQuestions`: Minimum 10 questions spanning open source, hackathons, existing solutions, technology, and market categories.
  - `researchDimensions`: Minimum 7 dimensions (GitHub, Open Source, Commercial SaaS, Startups, Hackathons, Research, etc.) with **2 to 3 target search queries per dimension**.
  - `searchConcepts`: Minimum 10 concepts with **2 to 3 tailored search queries per concept**.

### Agent 2: Researcher Agent
- **LLM & Tools**: Gemini API + Tavily Search API + GitHub REST API.
- **Purpose**: Performs multi-round discovery, candidate entity classification, single-pass field extraction, and candidate enrichment.
- **Execution Flow**:
  1. **Discovery Loop**: Generates 8–15 targeted search queries per round across web (Tavily/Gemini) and GitHub.
  2. **Dual Search**: Executes web and GitHub searches in parallel.
  3. **Entity Classification**: Groups raw web sources into candidate entities (`direct`, `adjacent`, `technical`, `irrelevant`).
  4. **Single-Pass LLM Extraction**: Extracts detailed fields (`description`, `features`, `limitations`, `problemSolved`, `approach`, `workflow`, `technologies`) directly from accumulated search sources without burning extra web search API tokens.
  5. **Guaranteed Solution Synthesis (`ensureCompleteSolutionFields`)**: Fallback synthesizer guarantees every solution candidate contains:
     - `description`: 2–3 sentence detailed overview.
     - `features`: Minimum 2 concrete user/system capabilities.
     - `limitations`: Minimum 1 realistic technical, platform, or operational trade-off/limitation.
  6. **Shortlisting**: Sorts and retains the **top 15 complete, validated solutions** in `discoveredSolutions`.
  7. **Domain Coverage Detection**: Dynamically calculates coverage across commercial products, startups, GitHub repos, hackathons, and research papers.

### Agent 3: Innovation Agent
- **LLM**: Gemini API (`gemini-flash-lite-latest`).
- **Purpose**: Consumes Problem Analysis from Agent 1 and 15 Shortlisted Solutions from Agent 2 to synthesize feature/gap matrices and design a winning hackathon project architecture.

---

## 4. API Endpoints

| HTTP Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/hackathons` | Creates a new hackathon project. |
| `POST` | `/api/hackathons/:id/start` | Triggers the LangGraph multi-agent execution pipeline. |
| `GET` | `/api/hackathons/:id/status` | Returns real-time execution status and atomic usage metrics. |
| `GET` | `/api/hackathons/:id/analysis` | Retrieves Agent 1 (Strategist) Problem Analysis payload. |
| `GET` | `/api/hackathons/:id/research` | Retrieves Agent 2 (Researcher) Discovered Solutions, Sources, Coverage & Metrics. |

---

## 5. Key Architecture & Schema Rules

1. **Zod Structured Output Compatibility**:
   - Fields use `.optional()` instead of `.nullable()` or `.default([])` to maintain strict compatibility with Gemini's Proto response schemas.
2. **Atomic Usage Metrics Tracking**:
   - `addUsageMetrics` uses MongoDB `$inc` updates to sync `geminiCalls`, `tavilyCalls`, `githubCalls`, `sourcesFound`, `uniqueSources`, and `enrichedSolutions` in real time.
3. **Single-Pass Extraction Efficiency**:
   - Prevents search token exhaustion by extracting complete solution details directly from collected search snippets.

---

## 6. Active Environment Variables (`.env`)

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://ansumanpadhy07_db_user:...@cluster0.alvg5he.mongodb.net/hackforge?retryWrites=true&w=majority&appName=Cluster0

GEMINI_API_KEY=AIzaSyDtDTK0GNmywl5aukmNqqdwernkTfYvXJs
GEMINI_MODEL=gemini-flash-lite-latest

GROQ_API_KEY=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
GROQ_MODEL=openai/gpt-oss-20b

TAVILY_API_KEY=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
GITHUB_TOKEN=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

VECTOR_DB_PROVIDER=mongodb
VECTOR_DB_URL=mongodb+srv://ansumanpadhy07_db_user:...@cluster0.alvg5he.mongodb.net/hackforge?retryWrites=true&w=majority&appName=Cluster0
```
