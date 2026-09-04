import { Check, Loader2, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/section"
import { ScoreBar } from "@/components/widgets"
import type { CandidateIdea, InnovationResult } from "@/lib/types"

const complexityVariant = {
  low: "secondary",
  medium: "accent",
  high: "destructive",
} as const

function CandidateCard({
  idea,
  selected,
  onSelect,
  selecting,
}: {
  idea: CandidateIdea
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
      <div className="mb-1 flex items-start justify-between gap-3">
        <div>
          <h5 className="text-base font-semibold">{idea.name}</h5>
          <p className="mt-1 text-sm text-muted-foreground">
            {idea.oneLineDescription}
          </p>
        </div>
        <Badge
          variant={complexityVariant[idea.estimatedComplexity] ?? "secondary"}
          className="shrink-0 capitalize"
        >
          {idea.estimatedComplexity}
        </Badge>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {idea.detailedDescription}
      </p>

      {idea.keyFeatures && idea.keyFeatures.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {idea.keyFeatures.slice(0, 5).map((f) => (
            <Badge key={f.name} variant="outline" className="font-normal">
              {f.name}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        <ScoreBar label="Innovation" value={idea.innovationScore} />
        <ScoreBar label="Impact" value={idea.impactScore} />
        <ScoreBar label="Differentiation" value={idea.differentiationScore} />
        <ScoreBar label="Overall" value={idea.overallConceptScore} />
      </div>

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
            onClick={() => onSelect(idea.id)}
          >
            {selecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Build on this idea
          </Button>
        )}
      </div>
    </div>
  )
}

export function InnovationSection({
  innovation,
  onSelect,
  selectingId,
}: {
  innovation: InnovationResult
  onSelect: (id: string) => void
  selectingId: string | null
}) {
  const selectedId = innovation.selectedIdea?.id

  return (
    <Section
      icon={<Sparkles className="h-4 w-4" />}
      title="Candidate ideas"
      description="Pick the concept you want to build around."
    >
      {innovation.candidateIdeas.length === 0 ? (
        <p className="text-sm text-muted-foreground">No ideas generated yet.</p>
      ) : (
        <div className="space-y-3">
          {innovation.candidateIdeas.map((idea) => (
            <CandidateCard
              key={idea.id}
              idea={idea}
              selected={selectedId === idea.id}
              onSelect={onSelect}
              selecting={selectingId === idea.id}
            />
          ))}
        </div>
      )}

      {innovation.differentiation?.summary && (
        <div className="rounded-lg bg-muted/40 p-4 text-sm leading-relaxed">
          {innovation.differentiation.summary}
        </div>
      )}

      {innovation.noveltyAssessment &&
        innovation.noveltyAssessment.strongestDifferentiators.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Strongest differentiators</h4>
            <ul className="space-y-1.5">
              {innovation.noveltyAssessment.strongestDifferentiators
                .slice(0, 4)
                .map((d, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span>{d}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
    </Section>
  )
}
