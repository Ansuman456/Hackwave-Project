import { CheckCircle2, Crosshair, Lightbulb, ShieldAlert, Target, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Section } from "@/components/section"
import { SeverityBadge } from "@/components/widgets"
import type { ProblemAnalysis } from "@/lib/types"

function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  return (
    <Badge variant="outline" className="tabular-nums">
      {pct}% confidence
    </Badge>
  )
}

export function AnalysisSection({ analysis }: { analysis: ProblemAnalysis }) {
  const mustHave = analysis.explicitRequirements.filter(
    (r) => r.priority === "must"
  )

  return (
    <Section
      icon={<Crosshair className="h-4 w-4" />}
      title="Problem analysis"
      description="The strategist agent's read of your problem."
      right={<ConfidenceBadge value={analysis.analysisConfidence} />}
    >
      <div className="rounded-lg bg-muted/40 p-4">
        <p className="text-sm leading-relaxed text-foreground">
          {analysis.problemSummary}
        </p>
      </div>

      {analysis.targetUsers.length > 0 && (
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Users className="h-4 w-4 text-muted-foreground" />
            Target users
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.targetUsers.map((u) => (
              <Badge key={u.role} variant="secondary">
                {u.role}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {analysis.painPoints.length > 0 && (
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-medium">
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            Pain points
          </h4>
          <ul className="space-y-2">
            {analysis.painPoints.slice(0, 5).map((p, i) => (
              <li key={i} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-foreground">{p.description}</span>
                <SeverityBadge severity={p.severity} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {mustHave.length > 0 && (
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-medium">
            <Target className="h-4 w-4 text-muted-foreground" />
            Must-have requirements
          </h4>
          <ul className="space-y-1.5">
            {mustHave.slice(0, 6).map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{r.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.constraints.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Key constraints</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.constraints.slice(0, 8).map((c, i) => (
              <Badge key={i} variant="outline" className="gap-1.5 font-normal">
                {c.description}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {analysis.successCriteria.length > 0 && (
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-medium">
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
            What success looks like
          </h4>
          <ul className="space-y-1.5">
            {analysis.successCriteria.slice(0, 5).map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  )
}
