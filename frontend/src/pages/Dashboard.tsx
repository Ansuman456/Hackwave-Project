import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Check, Circle, Plus, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/widgets"
import { listHackathons } from "@/lib/api"
import type { ProjectSummary, ProjectStages } from "@/lib/types"

const STAGES: Array<{ key: keyof ProjectStages; label: string }> = [
  { key: "strategist", label: "Strategist" },
  { key: "researcher", label: "Researcher" },
  { key: "innovation", label: "Innovation" },
  { key: "team", label: "Team Architect" },
  { key: "architecture", label: "Architecture" },
]

function StageProgress({ stages }: { stages?: ProjectStages }) {
  const doneCount = stages
    ? STAGES.filter((s) => stages[s.key]).length
    : 0

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {STAGES.map((stage) => {
        const done = stages?.[stage.key] ?? false
        return (
          <Badge
            key={stage.key}
            variant={done ? "default" : "secondary"}
            className="gap-1.5"
            title={stage.label}
          >
            {done ? (
              <Check className="h-3 w-3" />
            ) : (
              <Circle className="h-3 w-3" />
            )}
            {stage.label}
          </Badge>
        )
      })}
      <span className="ml-1 text-xs text-muted-foreground tabular-nums">
        {doneCount}/{STAGES.length}
      </span>
    </div>
  )
}

function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link to={`/project/${project.projectId}`}>
      <Card className="transition-colors hover:border-foreground/30">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {project.hackathonName && (
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  {project.hackathonName}
                </p>
              )}
              <CardTitle className="line-clamp-2 text-base leading-snug">
                {project.problemStatement}
              </CardTitle>
            </div>
            <StatusBadge status={project.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <StageProgress stages={project.stages} />
          {project.createdAt && (
            <p className="text-xs text-muted-foreground">
              Created{" "}
              {new Date(project.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

export default function Dashboard() {
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    listHackathons()
      .then((data) => {
        if (active) setProjects(data)
      })
      .catch((err) => {
        if (active)
          setError(err instanceof Error ? err.message : "Failed to load projects")
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Your projects
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track each problem statement and its pipeline stages.
          </p>
        </div>
        <Button asChild>
          <Link to="/create">
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {projects === null && !error && (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {projects && projects.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">No projects yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first hackathon analysis to see it here.
              </p>
            </div>
            <Button asChild>
              <Link to="/create">
                <Plus className="h-4 w-4" />
                Start a project
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {projects && projects.length > 0 && (
        <div className="space-y-3">
          {projects.map((project) => (
            <ProjectCard key={project.projectId} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
