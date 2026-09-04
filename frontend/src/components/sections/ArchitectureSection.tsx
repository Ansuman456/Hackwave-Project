import { Boxes, Clock, Database, Route, ShieldAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Section } from "@/components/section"
import { SeverityBadge } from "@/components/widgets"
import type { ArchitectureResult } from "@/lib/types"

const METHOD_VARIANT: Record<string, "default" | "secondary" | "outline" | "accent" | "destructive"> = {
  GET: "secondary",
  POST: "accent",
  PUT: "outline",
  PATCH: "outline",
  DELETE: "destructive",
}

export function ArchitectureSection({
  architecture,
}: {
  architecture: ArchitectureResult
}) {
  return (
    <Section
      icon={<Boxes className="h-4 w-4" />}
      title="System architecture"
      description={`Designed around ${architecture.selectedTechStack.name}`}
    >
      <div className="rounded-lg bg-muted/40 p-4">
        <p className="text-sm leading-relaxed">{architecture.architectureOverview}</p>
      </div>

      {architecture.components.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Components</h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {architecture.components.map((c) => (
              <div key={c.name} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-medium">{c.name}</h5>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {c.technology}
                  </Badge>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {c.purpose}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {architecture.apiContracts && architecture.apiContracts.length > 0 && (
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-medium">
            <Route className="h-4 w-4 text-muted-foreground" />
            API endpoints
          </h4>
          <div className="space-y-1.5">
            {architecture.apiContracts.slice(0, 10).map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm"
              >
                <Badge
                  variant={METHOD_VARIANT[a.method] ?? "outline"}
                  className="w-16 justify-center tabular-nums"
                >
                  {a.method}
                </Badge>
                <code className="flex-1 truncate font-mono text-xs">{a.path}</code>
                <span className="hidden truncate text-xs text-muted-foreground sm:inline">
                  {a.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {architecture.databaseSchema && architecture.databaseSchema.length > 0 && (
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-medium">
            <Database className="h-4 w-4 text-muted-foreground" />
            Data collections
          </h4>
          <div className="flex flex-wrap gap-2">
            {architecture.databaseSchema.map((d) => (
              <Badge key={d.collectionName} variant="outline" className="font-normal">
                {d.collectionName}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {architecture.implementationPlan && architecture.implementationPlan.length > 0 && (
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Implementation plan
          </h4>
          <div className="space-y-2">
            {architecture.implementationPlan.map((phase) => (
              <div key={phase.phase} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-medium">
                    Phase {phase.phase} — {phase.name}
                  </h5>
                  <span className="text-xs text-muted-foreground">
                    {phase.duration}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {architecture.risks && architecture.risks.length > 0 && (
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-medium">
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            Key risks
          </h4>
          <div className="space-y-2">
            {architecture.risks.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-start justify-between gap-3 text-sm">
                <span>{r.description}</span>
                <SeverityBadge severity={r.severity as "low" | "medium" | "high" | "critical"} />
              </div>
            ))}
          </div>
        </div>
      )}

      {architecture.estimatedDemoReadiness && (
        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Estimated demo readiness</span>
          <span className="font-medium">{architecture.estimatedDemoReadiness}</span>
        </div>
      )}
    </Section>
  )
}
