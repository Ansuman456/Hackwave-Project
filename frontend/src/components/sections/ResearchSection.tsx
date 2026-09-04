import { ExternalLink, FlaskConical, GitBranch } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Section } from "@/components/section"
import { Stat } from "@/components/widgets"
import type { DiscoveredSolution, ResearchResult } from "@/lib/types"

function SolutionCard({ solution }: { solution: DiscoveredSolution }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-1.5 flex items-start justify-between gap-3">
        <h5 className="text-sm font-medium">{solution.name}</h5>
        {solution.relationToProblem && (
          <Badge variant="secondary" className="capitalize shrink-0">
            {solution.relationToProblem}
          </Badge>
        )}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {solution.description}
      </p>

      {solution.technologies && solution.technologies.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {solution.technologies.slice(0, 6).map((t) => (
            <Badge key={t} variant="outline" className="font-normal">
              {t}
            </Badge>
          ))}
        </div>
      )}

      {(solution.website || solution.githubRepository) && (
        <div className="mt-3 flex items-center gap-4">
          {solution.website && (
            <a
              href={solution.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Website
            </a>
          )}
          {solution.githubRepository && (
            <a
              href={solution.githubRepository}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <GitBranch className="h-3.5 w-3.5" />
              Repository
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export function ResearchSection({ research }: { research: ResearchResult }) {
  const { summary } = research

  return (
    <Section
      icon={<FlaskConical className="h-4 w-4" />}
      title="Market research"
      description="What already exists and where the gaps are."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Sources found" value={summary.uniqueSources ?? summary.sourcesFound} />
        <Stat label="Relevant solutions" value={summary.relevantSolutions} />
        <Stat label="Direct" value={summary.directSolutions} />
        <Stat label="Adjacent" value={summary.adjacentSolutions} />
      </div>

      {research.discoveredSolutions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Notable existing solutions</h4>
          <div className="space-y-2">
            {research.discoveredSolutions.slice(0, 6).map((s) => (
              <SolutionCard key={s.id} solution={s} />
            ))}
          </div>
        </div>
      )}

      {research.unresolvedQuestions &&
        research.unresolvedQuestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Open questions</h4>
            <ul className="space-y-1.5">
              {research.unresolvedQuestions.slice(0, 5).map((q, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
    </Section>
  )
}
