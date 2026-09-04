import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import {
  AlertTriangle,
  Check,
  Circle,
  Copy,
  Loader2,
  RefreshCw,
  Rocket,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/widgets"
import { AnalysisSection } from "@/components/sections/AnalysisSection"
import { ResearchSection } from "@/components/sections/ResearchSection"
import { InnovationSection } from "@/components/sections/InnovationSection"
import { TeamSection } from "@/components/sections/TeamSection"
import { ArchitectureSection } from "@/components/sections/ArchitectureSection"
import {
  getAnalysis,
  getArchitecture,
  getInnovation,
  getProjectStatus,
  getResearch,
  getTeam,
  selectCandidate,
  selectTechStack,
  startWorkflow,
} from "@/lib/api"
import type {
  ArchitectureResult,
  InnovationResult,
  ProblemAnalysis,
  ProjectStatus,
  ResearchResult,
  TeamAnalysis,
} from "@/lib/types"

async function safeGet<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn()
  } catch {
    return null
  }
}

interface AgentStep {
  key: string
  label: string
  done: boolean
}

export default function Project() {
  const { id } = useParams<{ id: string }>()
  const projectId = id as string

  const [status, setStatus] = useState<ProjectStatus | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<ProblemAnalysis | null>(null)
  const [research, setResearch] = useState<ResearchResult | null>(null)
  const [innovation, setInnovation] = useState<InnovationResult | null>(null)
  const [team, setTeam] = useState<TeamAnalysis | null>(null)
  const [architecture, setArchitecture] = useState<ArchitectureResult | null>(null)
  const [starting, setStarting] = useState(false)
  const [selectingCandidate, setSelectingCandidate] = useState<string | null>(null)
  const [selectingStack, setSelectingStack] = useState<string | null>(null)

  const startedRef = useRef(false)

  useEffect(() => {
    let active = true
    let timer: ReturnType<typeof setTimeout> | undefined

    async function tick() {
      if (!active) return
      try {
        const s = await getProjectStatus(projectId)
        if (!active) return
        setStatus(s.status)
        setLastError(s.lastError ?? null)

        if (s.status === "idle" && !startedRef.current) {
          startedRef.current = true
          setStarting(true)
          try {
            await startWorkflow(projectId)
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to start")
          }
          if (!active) return
          setStarting(false)
        }

        const analysisData = await safeGet(() => getAnalysis(projectId))
        const researchData = await safeGet(() => getResearch(projectId))
        const innovationData = await safeGet(() => getInnovation(projectId))
        const teamData = await safeGet(() => getTeam(projectId))
        const archData = await safeGet(() => getArchitecture(projectId))
        if (!active) return

        if (analysisData?.analysis) setAnalysis(analysisData.analysis)
        if (researchData?.result) setResearch(researchData.result)
        if (innovationData?.result) setInnovation(innovationData.result)
        if (teamData?.result) setTeam(teamData.result)
        if (archData?.result) setArchitecture(archData.result)

        if (s.status === "failed") return
        if (archData?.result) return
      } catch {
        // ignore transient errors, keep polling
      }
      timer = setTimeout(tick, 3000)
    }

    tick()
    return () => {
      active = false
      if (timer) clearTimeout(timer)
    }
  }, [projectId])

  async function handleSelectCandidate(candidateId: string) {
    setSelectingCandidate(candidateId)
    try {
      await selectCandidate(projectId, candidateId)
      toast.success("Idea selected. Team architect is now working…")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to select idea")
    } finally {
      setSelectingCandidate(null)
    }
  }

  async function handleSelectStack(optionId: string) {
    setSelectingStack(optionId)
    try {
      await selectTechStack(projectId, optionId)
      toast.success("Stack selected. Generating architecture…")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to select stack")
    } finally {
      setSelectingStack(null)
    }
  }

  function copyId() {
    navigator.clipboard?.writeText(projectId)
    toast.success("Project ID copied")
  }

  const agents: AgentStep[] = [
    { key: "strategist", label: "Strategist", done: !!analysis },
    { key: "researcher", label: "Researcher", done: !!research },
    { key: "innovation", label: "Innovation", done: !!innovation },
    { key: "team", label: "Team Architect", done: !!team },
    { key: "cto", label: "CTO", done: !!architecture },
  ]

  const isRunning = status === "running"
  const activeAgent = isRunning ? agents.find((a) => !a.done) : undefined

  const waitingMessage =
    status === "awaiting_selection" ||
    (status === "completed" && innovation && !innovation.selectedIdea)
      ? "Choose a candidate idea to continue."
      : status === "completed" && team && !team.selectedTechStack && !architecture
        ? "Choose a tech stack to continue."
        : null

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Project analysis
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={copyId}
                className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                title="Copy project ID"
              >
                {projectId}
                <Copy className="h-3 w-3" />
              </button>
              {status && <StatusBadge status={status} />}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>

        {waitingMessage && (
          <p className="mt-4 text-sm text-muted-foreground">{waitingMessage}</p>
        )}

        {status === "failed" && lastError && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{lastError}</span>
          </div>
        )}
      </div>

      {status === null ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : (
        <>
          {starting ? (
            <Card>
              <CardContent className="flex items-center gap-3 p-6 text-sm">
                <Rocket className="h-4 w-4 text-primary" />
                Starting the agent pipeline…
              </CardContent>
            </Card>
          ) : (
            !analysis && isRunning && (
              <Card>
                <CardContent className="space-y-3 p-6">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    Agents are working on your problem
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {agents.map((agent) => (
                      <Badge
                        key={agent.key}
                        variant={agent.done ? "default" : "secondary"}
                        className="gap-1.5"
                      >
                        {agent.done ? (
                          <Check className="h-3 w-3" />
                        ) : activeAgent?.key === agent.key ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Circle className="h-3 w-3" />
                        )}
                        {agent.label}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          )}

          <div className="space-y-6">
            {analysis && <AnalysisSection analysis={analysis} />}
            {research && <ResearchSection research={research} />}
            {innovation && innovation.candidateIdeas.length > 0 && (
              <InnovationSection
                innovation={innovation}
                onSelect={handleSelectCandidate}
                selectingId={selectingCandidate}
              />
            )}
            {team && <TeamSection team={team} onSelectStack={handleSelectStack} selectingId={selectingStack} />}
            {architecture && <ArchitectureSection architecture={architecture} />}

            {agents.every((a) => a.done) && (
              <p className="pt-2 text-center text-sm text-muted-foreground">
                Analysis complete. Good luck building!
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
