import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  FileText,
  Link2,
  Loader2,
  Plus,
  Trash2,
  Upload,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { createHackathon, type CreateHackathonPayload } from "@/lib/api"

interface Criteria {
  id: string
  name: string
  weight: string
}

interface Member {
  id: string
  name: string
  githubUrl: string
  resume: File | null
  resumeName: string
}

function uid() {
  return crypto.randomUUID()
}

function deriveUsername(url: string): string {
  try {
    const parsed = new URL(url.trim())
    const parts = parsed.pathname.split("/").filter(Boolean)
    return parts[parts.length - 1] ?? ""
  } catch {
    return ""
  }
}

export default function Create() {
  const navigate = useNavigate()

  const [problemStatement, setProblemStatement] = useState("")
  const [hackathonName, setHackathonName] = useState("")
  const [hackathonDesc, setHackathonDesc] = useState("")
  const [durationHours, setDurationHours] = useState("")
  const [criteria, setCriteria] = useState<Criteria[]>([
    { id: uid(), name: "", weight: "" },
  ])
  const [rules, setRules] = useState("")
  const [members, setMembers] = useState<Member[]>([
    { id: uid(), name: "", githubUrl: "", resume: null, resumeName: "" },
  ])
  const [submitting, setSubmitting] = useState(false)

  function addCriteria() {
    setCriteria((prev) => [...prev, { id: uid(), name: "", weight: "" }])
  }

  function updateCriteria(id: string, patch: Partial<Criteria>) {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    )
  }

  function removeCriteria(id: string) {
    setCriteria((prev) => prev.filter((c) => c.id !== id))
  }

  function addMember() {
    setMembers((prev) => [
      ...prev,
      { id: uid(), name: "", githubUrl: "", resume: null, resumeName: "" },
    ])
  }

  function updateMember(id: string, patch: Partial<Member>) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    )
  }

  function removeMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  function onResumeChange(id: string, file: File | null) {
    updateMember(id, { resume: file, resumeName: file?.name ?? "" })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (problemStatement.trim().length < 10) {
      toast.error("Problem statement must be at least 10 characters.")
      return
    }

    const githubLinks = members
      .filter((m) => m.githubUrl.trim())
      .map((m) => ({
        githubProfileUrl: m.githubUrl.trim(),
        username: deriveUsername(m.githubUrl),
      }))

    const resumeFiles = members
      .filter((m) => m.resume)
      .map((m) => m.resume as File)

    const judgingCriteria = criteria
      .filter((c) => c.name.trim())
      .map((c) => ({
        name: c.name.trim(),
        ...(c.weight.trim() ? { weight: Number(c.weight) } : {}),
      }))

    const ruleList = rules
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean)

    const hackathon: CreateHackathonPayload["hackathon"] = {}
    if (hackathonName.trim()) hackathon.name = hackathonName.trim()
    if (hackathonDesc.trim()) hackathon.description = hackathonDesc.trim()
    if (durationHours.trim()) hackathon.durationHours = Number(durationHours)
    if (judgingCriteria.length) hackathon.judgingCriteria = judgingCriteria
    if (ruleList.length) hackathon.rules = ruleList

    setSubmitting(true)
    try {
      const result = await createHackathon({
        problemStatement: problemStatement.trim(),
        hackathon: Object.keys(hackathon).length ? hackathon : undefined,
        githubLinks,
        teamSize: members.length,
        resumeFiles,
      })
      toast.success("Project created. Starting the analysis pipeline…")
      navigate(`/project/${result.projectId}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          New project
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tell HackBuddy about your hackathon and team. Five AI agents will do the
          heavy lifting.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Problem statement
            </CardTitle>
            <CardDescription>
              What are you trying to solve? Be specific — this drives everything.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="e.g. Farmers in rural areas lack a low-bandwidth way to detect crop diseases early…"
              rows={5}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {problemStatement.trim().length} characters (min. 10)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hackathon details</CardTitle>
            <CardDescription>
              Optional context — rules and judging criteria sharpen the analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hack-name">Name</Label>
                <Input
                  id="hack-name"
                  value={hackathonName}
                  onChange={(e) => setHackathonName(e.target.value)}
                  placeholder="AgriHack 2026"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  placeholder="48"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hack-desc">Description</Label>
              <Textarea
                id="hack-desc"
                value={hackathonDesc}
                onChange={(e) => setHackathonDesc(e.target.value)}
                placeholder="A 48-hour hackathon focused on agritech…"
                rows={2}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Judging criteria</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addCriteria}
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              {criteria.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <Input
                    value={c.name}
                    onChange={(e) => updateCriteria(c.id, { name: e.target.value })}
                    placeholder="Impact"
                    className="flex-1"
                  />
                  <Input
                    value={c.weight}
                    onChange={(e) => updateCriteria(c.id, { weight: e.target.value })}
                    placeholder="Weight %"
                    type="number"
                    min={0}
                    max={100}
                    className="w-28"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCriteria(c.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rules">Rules (one per line)</Label>
              <Textarea
                id="rules"
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                placeholder={"Must submit a working prototype\nTeam size 2–5"}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Team members
            </CardTitle>
            <CardDescription>
              Upload a resume and (optionally) link a GitHub profile for each member.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {members.map((member, index) => (
              <div key={member.id} className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Member {index + 1}
                  </span>
                  {members.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full name (optional)</Label>
                    <Input
                      value={member.name}
                      onChange={(e) => updateMember(member.id, { name: e.target.value })}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Link2 className="h-3.5 w-3.5" />
                      GitHub profile URL
                    </Label>
                    <Input
                      value={member.githubUrl}
                      onChange={(e) =>
                        updateMember(member.id, { githubUrl: e.target.value })
                      }
                      placeholder="https://github.com/janedoe"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label>Resume (PDF)</Label>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground transition-colors hover:bg-muted/50">
                    <Upload className="h-4 w-4" />
                    {member.resumeName || "Choose a PDF file"}
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onChange={(e) =>
                        onResumeChange(member.id, e.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={addMember}
            >
              <Plus className="h-4 w-4" />
              Add team member
            </Button>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            {submitting ? "Analysing…" : "Start analysis"}
          </Button>
        </div>
      </form>
    </div>
  )
}
