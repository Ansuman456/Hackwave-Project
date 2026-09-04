import type {
  ApiEnvelope,
  ArchitectureResult,
  AuthUser,
  GithubLink,
  HackathonDetails,
  InnovationResult,
  ProblemAnalysis,
  ProjectStatus,
  ProjectSummary,
  ResearchResult,
  TeamAnalysis,
} from "./types"

const BASE = "/api"

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: {
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
    ...options,
  })

  let body: ApiEnvelope<T> | null = null
  try {
    body = (await res.json()) as ApiEnvelope<T>
  } catch {
    // non-JSON response; body remains null
  }

  if (!res.ok) {
    const message =
      body?.error ||
      body?.message ||
      (body && "details" in body ? body.details : undefined) ||
      `Request failed (${res.status})`
    throw new Error(String(message))
  }

  return body?.data as T
}

// ---------------------------------------------------------------
// Auth
// ---------------------------------------------------------------
interface AuthResponse {
  success: boolean
  message?: string
  user?: AuthUser
}

async function authRequest(path: string, body?: Record<string, unknown>): Promise<AuthUser | null> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = (await res.json()) as AuthResponse
  if (!res.ok) {
    throw new Error(data.message || "Request failed")
  }
  return data.user ?? null
}

export function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthUser | null> {
  return authRequest("/auth/register", { name, email, password })
}

export function loginUser(
  email: string,
  password: string
): Promise<AuthUser | null> {
  return authRequest("/auth/login", { email, password })
}

export async function logoutUser(): Promise<void> {
  await fetch(`${BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  })
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const res = await fetch(`${BASE}/auth/me`, {
    credentials: "include",
  })
  if (res.status === 401) return null
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as AuthResponse | null
    throw new Error(data?.message || "Failed to fetch user")
  }
  const data = (await res.json()) as { success: boolean; user: AuthUser }
  return data.user
}

// ---------------------------------------------------------------
// Create
// ---------------------------------------------------------------
export interface CreateHackathonPayload {
  problemStatement: string
  hackathon?: HackathonDetails
  githubLinks: GithubLink[]
  userConstraints?: string[]
  teamSize?: number
  resumeFiles: File[]
}

export interface CreateHackathonResult {
  projectId: string
  status: string
  parsedResumeCount?: number
  createdAt?: string
}

export function createHackathon(
  payload: CreateHackathonPayload
): Promise<CreateHackathonResult> {
  const form = new FormData()
  form.append("problemStatement", payload.problemStatement)
  if (payload.hackathon) {
    form.append("hackathon", JSON.stringify(payload.hackathon))
  }
  if (payload.githubLinks.length > 0) {
    form.append("githubLinks", JSON.stringify(payload.githubLinks))
  }
  if (payload.userConstraints && payload.userConstraints.length > 0) {
    form.append("userConstraints", JSON.stringify(payload.userConstraints))
  }
  if (payload.teamSize) {
    form.append("teamSize", String(payload.teamSize))
  }
  for (const file of payload.resumeFiles) {
    form.append("resumes", file)
  }

  return request<CreateHackathonResult>("/hackathons", {
    method: "POST",
    body: form,
  })
}

// ---------------------------------------------------------------
// Status & workflow
// ---------------------------------------------------------------
export interface ProjectStatusData {
  projectId: string
  status: ProjectStatus
  lastError?: string | null
  executionErrors?: unknown[]
  createdAt?: string
  updatedAt?: string
}

export function getProjectStatus(id: string): Promise<ProjectStatusData> {
  return request<ProjectStatusData>(`/hackathons/${id}/status`)
}

export function listHackathons(): Promise<ProjectSummary[]> {
  return request<ProjectSummary[]>("/hackathons")
}

export function startWorkflow(id: string): Promise<{ projectId: string; status: string }> {
  return request(`/hackathons/${id}/start`, { method: "POST" })
}

// ---------------------------------------------------------------
// Agent results
// ---------------------------------------------------------------
export interface AnalysisData {
  projectId: string
  version?: number
  analysis: ProblemAnalysis
  createdAt?: string
}

export function getAnalysis(id: string): Promise<AnalysisData> {
  return request<AnalysisData>(`/hackathons/${id}/analysis`)
}

export interface ResearchData {
  projectId: string
  researchId?: string
  status?: string
  result?: ResearchResult
}

export function getResearch(id: string): Promise<ResearchData> {
  return request<ResearchData>(`/hackathons/${id}/research`)
}

export interface InnovationData {
  projectId: string
  innovationId?: string
  status?: string
  candidateCount?: number
  selectedCandidateId?: string | null
  result?: InnovationResult
}

export function getInnovation(id: string): Promise<InnovationData> {
  return request<InnovationData>(`/hackathons/${id}/innovation`)
}

export function selectCandidate(
  id: string,
  candidateId: string
): Promise<{ projectId: string; selectedCandidateId: string }> {
  return request(`/hackathons/${id}/select-candidate`, {
    method: "POST",
    body: JSON.stringify({ candidateId }),
  })
}

export interface TeamData {
  projectId: string
  teamAnalysisId?: string
  status?: string
  teamMemberCount?: number
  feasibilityScore?: number
  techStackOptionCount?: number
  selectedTechStackId?: string | null
  result?: TeamAnalysis
}

export function getTeam(id: string): Promise<TeamData> {
  return request<TeamData>(`/hackathons/${id}/team`)
}

export function selectTechStack(
  id: string,
  optionId: string
): Promise<{ projectId: string; selectedOptionId: string }> {
  return request(`/hackathons/${id}/select-tech-stack`, {
    method: "POST",
    body: JSON.stringify({ optionId }),
  })
}

export interface ArchitectureData {
  projectId: string
  architectureId?: string
  status?: string
  result?: ArchitectureResult
}

export function getArchitecture(id: string): Promise<ArchitectureData> {
  return request<ArchitectureData>(`/hackathons/${id}/architecture`)
}
