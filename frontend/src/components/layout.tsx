import { Link, NavLink, Outlet } from "react-router-dom"
import { Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

function SiteHeader() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
      isActive && "text-foreground"
    )

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight">HackBuddy</span>
        </Link>

        <nav className="flex items-center gap-6">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/create" className={linkClass}>
            New Project
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 text-sm text-muted-foreground">
        <p>HackBuddy — AI Hackathon Intelligence</p>
        <p className="text-xs">Built for builders.</p>
      </div>
    </footer>
  )
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
