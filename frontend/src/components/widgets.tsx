import type { ProjectStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

import { Badge, type BadgeProps } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const STATUS_LABEL: Record<ProjectStatus, string> = {
  idle: "Idle",
  running: "Running",
  paused: "Paused",
  completed: "Completed",
  failed: "Failed",
  cancel_requested: "Cancelling",
  awaiting_selection: "Choose an idea",
}

const STATUS_VARIANT: Record<ProjectStatus, BadgeProps["variant"]> = {
  idle: "secondary",
  running: "accent",
  paused: "secondary",
  completed: "default",
  failed: "destructive",
  cancel_requested: "secondary",
  awaiting_selection: "outline",
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status] ?? "secondary"}>
      {STATUS_LABEL[status] ?? status}
    </Badge>
  )
}

export function ScoreBar({
  label,
  value,
  max = 10,
  className,
}: {
  label: string
  value: number
  max?: number
  className?: string
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">
          {Number.isFinite(value) ? value.toFixed(1) : "—"}
        </span>
      </div>
      <Progress value={pct} />
    </div>
  )
}

export type Severity = "low" | "medium" | "high" | "critical"

function severityVariant(severity: Severity): BadgeProps["variant"] {
  switch (severity) {
    case "high":
    case "critical":
      return "destructive"
    case "medium":
      return "accent"
    default:
      return "secondary"
  }
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <Badge variant={severityVariant(severity)} className="capitalize">
      {severity}
    </Badge>
  )
}

export function Stat({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-lg border bg-muted/40 px-4 py-3">
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
