import { Check, Layers, Loader2, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/section"
import { ScoreBar, SeverityBadge } from "@/components/widgets"
import type { TechStackOption, TeamAnalysis } from "@/lib/types"

function StackGroup({ label, items }: { label: string; items: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <div className="flex items-start gap-2">
      <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {items.map((t) => (
          <Badge key={t} variant="outline" className="font-normal">
            {t}
          </Badge>
        ))}
      </div>
    </div>
  )
}

function TechStackCard({
  option,
  selected,
  onSelect,
  selecting,
}: {
  option: TechStackOption
  selected: boolean
  onSelect: (id: string) => void
  selecting: boolean
}) {
  return (
    <div
      className={
        selected
          ? "rounded-lg border-2 border-primary p-5"
          : "rounded-lg border p-5"
      }
    >
      <div className="mb-2 flex items-center justify-between">
        <h5 className="text-base font-semibold">{option.name}</h5>
        <Badge variant="secondary" className="tabular-nums">
          #{option.rank}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{option.description}</p>

      <div className="mt-4 space-y-2">
        <StackGroup label="Frontend" items={option.frontend} />
        <StackGroup label="Backend" items={option.backend} />
        <StackGroup label="Database" items={option.database} />
        <StackGroup label="AI / ML" items={option.aiMl} />
        <StackGroup label="Infrastructure" items={option.infrastructure} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
        <ScoreBar label="Team fit" value={option.teamFitScore} />
        <ScoreBar label="Overall" value={option.overallScore} />
      </div>

      {option.merits.length > 0 && (
        <ul className="mt-3 space-y-1">
          {option.merits.slice(0, 3).map((m, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        {selected ? (
          <Button variant="secondary" className="w-full" disabled>
            <Check className="h-4 w-4" />
            Selected
          </Button>
        ) : (
          <Button
            className="w-full"
            disabled={selecting}
            onClick={() => onSelect(option.optionId)}
          >
            {selecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Layers className="h-4 w-4" />
            )}
            Use this stack
          </Button>
        )}
      </div>
    </div>
  )
}

export function TeamSection({
  team,
  onSelectStack,
  selectingId,
}: {
  team: TeamAnalysis
  onSelectStack: (id: string) => void
  selectingId: string | null
}) {
  const selectedStackId = team.selectedTechStack?.optionId

  return (
    <Section
      icon={<Users className="h-4 w-4" />}
      title="Team & tech stack"
      description="How your team maps to the build, and which stack fits best."
    >
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-muted-foreground">
          Feasibility
        </span>
        <div className="flex-1">
          <ScoreBar label="" value={team.feasibility.score} />
        </div>
        <div className="flex gap-1.5">
          <SeverityBadge severity={team.feasibility.timeRisk} />
          <SeverityBadge severity={team.feasibility.technicalRisk} />
          <SeverityBadge severity={team.feasibility.dataRisk} />
        </div>
      </div>

      {team.teamMembers.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Team</h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {team.teamMembers.map((m) => (
              <div key={m.memberId} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">{m.name}</h5>
                  {m.yearsExperience ? (
                    <span className="text-xs text-muted-foreground">
                      {m.yearsExperience} yrs
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs text-primary">{m.primaryRole}</p>
                {m.parsedSkills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.parsedSkills.slice(0, 6).map((s) => (
                      <Badge key={s} variant="secondary" className="font-normal">
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {team.roleAssignments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Role assignments</h4>
          <div className="space-y-1.5">
            {team.roleAssignments.map((r) => (
              <div
                key={r.roleTitle}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <span>{r.roleTitle}</span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span>{r.assignedMemberName}</span>
                  <Badge variant="secondary" className="tabular-nums">
                    {r.workloadPercentage}%
                  </Badge>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {team.skillGaps.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Skill gaps</h4>
          <div className="space-y-2">
            {team.skillGaps.map((g, i) => (
              <div key={i} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium">{g.missingCapability}</p>
                  <p className="text-xs text-muted-foreground">
                    {g.mitigationStrategy}
                  </p>
                </div>
                <SeverityBadge severity={g.riskLevel} />
              </div>
            ))}
          </div>
        </div>
      )}

      {team.techStackOptions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Tech stack options</h4>
          {team.techStackOptions.map((option) => (
            <TechStackCard
              key={option.optionId}
              option={option}
              selected={selectedStackId === option.optionId}
              onSelect={onSelectStack}
              selecting={selectingId === option.optionId}
            />
          ))}
        </div>
      )}
    </Section>
  )
}
