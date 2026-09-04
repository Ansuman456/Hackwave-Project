import { Link } from "react-router-dom"
import { ArrowRight, Bot, FileText, GitBranch, Layers, Target, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/context/auth"

const steps = [
  {
    icon: FileText,
    title: "Describe your hackathon",
    body: "Problem statement, hackathon rules and judging criteria — in one go.",
  },
  {
    icon: Bot,
    title: "Multi-agent analysis",
    body: "Five specialised agents research, analyse and architect your solution.",
  },
  {
    icon: Target,
    title: "Actionable insights",
    body: "Candidate ideas, team fit and a full technical architecture, distilled.",
  },
]

export default function Home() {
  const { user } = useAuth()
  const ctaHref = user ? "/create" : "/signup"

  return (
    <div className="mx-auto w-full max-w-6xl px-6">
      <section className="flex flex-col items-center py-24 text-center sm:py-32">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Zap className="h-3.5 w-3.5 text-primary" />
          Stateful multi-agent hackathon intelligence
        </div>
        <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">
          Turn a problem statement into a winning build plan
        </h1>
        <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
          HackBuddy runs a team of AI agents to analyse your problem, research the
          landscape, generate ideas and design the full architecture — so your team
          can focus on building.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to={ctaHref}>
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#how-it-works">How it works</a>
          </Button>
        </div>
      </section>

      <section id="how-it-works" className="py-16">
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <GitBranch className="h-3.5 w-3.5 text-primary" />
            How it works
          </span>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Five agents, one pipeline
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title}>
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16">
        <Card className="border-none bg-muted/50">
          <CardContent className="flex flex-col items-center gap-6 p-10 text-center sm:p-14">
            <Layers className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Ready to ideate and architect?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Drop in your team's resumes and GitHub links. HackBuddy parses them
                and matches each member to the right role in the build.
              </p>
            </div>
            <Button asChild size="lg">
              <Link to={ctaHref}>
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
