"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Network,
  LayoutDashboard,
  Monitor,
  Shield,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Home,
  Bell,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const navigation = [
  { name: "Dashboard", shortName: "Home", href: "/admin", icon: LayoutDashboard },
  { name: "Network Map", shortName: "Map", href: "/admin/network", icon: Network },
  { name: "Devices", shortName: "Devices", href: "/admin/devices", icon: Monitor },
  { name: "Alerts", shortName: "Alerts", href: "/admin/alerts", icon: Shield },
  { name: "Settings", shortName: "Settings", href: "/admin/settings", icon: Settings },
]

interface SessionUser {
  userId: string
  email: string
  fullName: string
  companyId: string
  companyName: string
  role: string
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then(({ user }) => {
        if (!user) {
          router.push("/login")
        } else {
          setCurrentUser(user)
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoadingSession(false))
  }, [router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [sidebarOpen])

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast.success("Signed out")
      router.push("/login")
      router.refresh()
    } catch {
      toast.error("Logout failed")
    }
  }

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-5 w-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    )
  }

  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md lg:hidden animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] bg-sidebar border-r border-sidebar-border lg:static lg:w-64 lg:translate-x-0 transition-transform duration-300 ease-in-out",
          !sidebarOpen && "max-lg:-translate-x-full",
          sidebarOpen ? "translate-x-0" : "max-lg:-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative h-9 w-9 rounded-xl bg-accent flex items-center justify-center">
                <Network className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <span className="text-base font-semibold tracking-tight text-sidebar-foreground">JishadNet</span>
                <p className="text-[10px] text-sidebar-foreground/50 uppercase tracking-wider">Admin Portal</p>
              </div>
            </Link>
            <button
              className="lg:hidden p-2 -mr-2 text-sidebar-foreground rounded-xl hover:bg-sidebar-accent"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Company Badge */}
          <div className="px-3 py-3 border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-sidebar-accent/30">
              <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-accent">
                  {currentUser.companyName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-sidebar-foreground/50 uppercase tracking-wider">Company</p>
                <p className="text-sm font-medium text-sidebar-foreground truncate">{currentUser.companyName}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              Navigation
            </p>
            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", active && "text-accent")} />
                  <span className="flex-1">{item.name}</span>
                  {active && <ChevronRight className="h-4 w-4 text-accent" />}
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions */}
          <div className="p-3 border-t border-sidebar-border">
            <Link href="/register">
              <Button variant="outline" className="w-full justify-start gap-2 h-11">
                <Plus className="h-4 w-4" />
                Register Device
              </Button>
            </Link>
          </div>

          {/* User section */}
          <div className="p-3 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-sidebar-accent/50">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center ring-2 ring-accent/20">
                <span className="text-sm font-semibold text-accent">
                  {currentUser.fullName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{currentUser.fullName}</p>
                <p className="text-xs text-sidebar-foreground/50 truncate">{currentUser.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-2 mt-2 text-sidebar-foreground/60 hover:text-sidebar-foreground h-10"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className=" min-h-screen flex flex-col pb-16 lg:pb-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-secondary"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link href="/admin" className="lg:hidden flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                  <Network className="h-4 w-4 text-accent-foreground" />
                </div>
                <span className="font-semibold">JishadNet</span>
              </Link>
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Admin</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {navigation.find((n) => isActive(n.href))?.name || "Dashboard"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-xl hover:bg-secondary lg:hidden">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
              </button>
              <ThemeToggle />
              <div className="hidden lg:flex items-center gap-3 pl-3 ml-3 border-l border-border">
                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-xs font-semibold">
                    {currentUser?.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{currentUser?.fullName}</p>
                  <p className="text-xs text-muted-foreground">{currentUser?.companyName}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-0 pb-24 lg:pb-20">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border safe-area-inset-bottom lg:left-64">
          <div className="flex items-center justify-around lg:justify-start h-16 px-2 lg:px-0 max-w-lg lg:max-w-none mx-auto lg:mx-0">
            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-0.5 px-4 py-2 min-w-[64px] rounded-lg transition-all",
                    active ? "text-accent" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-6 w-6 transition-transform", active && "scale-110")} />
                  <span className={cn("text-[10px] font-medium", active ? "opacity-100" : "opacity-70")}>
                    {item.shortName}
                  </span>
                  {active && (
                    <div
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                    />
                  )}
                </Link>
              )
            })}
            <Link
              href="/"
              className="flex flex-col items-center justify-center gap-0.5 px-4 py-2 min-w-[64px] rounded-lg text-muted-foreground hover:text-foreground transition-all"
            >
              <Home className="h-6 w-6" />
              <span className="text-[10px] font-medium opacity-70">Home</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
