"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Network,
  ArrowLeft,
  Loader2,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "sonner"

interface Company {
  id: string
  companyName: string
}

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [loadingCompanies, setLoadingCompanies] = useState(true)
  const [selectedCompany, setSelectedCompany] = useState("")


  const [credentials, setCredentials] = useState({ email: "", password: "" })

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then((data: Company[]) => {
        setCompanies(data)
        if (data.length > 0) setSelectedCompany(data[0].id)
      })
      .catch(() => setCompanies([]))
      .finally(() => setLoadingCompanies(false))
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!credentials.email || !credentials.password) {
      toast.error("Please enter your email and password")
      return
    }
    if (!selectedCompany) {
      toast.error("Please select a company")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          companyId: selectedCompany,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Login failed")
        return
      }

      toast.success("Login successful!")
      router.push("/admin")
      router.refresh()
    } catch {
      toast.error("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border safe-area-inset-top">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors touch-manipulation p-2 -ml-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm hidden sm:inline">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-accent flex items-center justify-center">
                <Network className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-semibold tracking-tight">JishadNet</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8 pb-8 safe-area-inset-bottom min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] flex items-center">
        <div className="mx-auto w-full max-w-md">
          <div
            className="text-center mb-8 sm:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <LogIn className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Login</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Access your company&apos;s device management dashboard
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100"
          >
            {loadingCompanies ? (
              <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading companies...</span>
              </div>
            ) : companies.length === 0 ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 sm:p-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-destructive mb-1">No Companies Found</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    No companies have been registered yet.
                  </p>
                  <Link href="/register/company" className="block mt-3">
                    <Button size="sm" variant="outline" className="w-full text-xs sm:text-sm">
                      Register Your Company
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Company Selector */}
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm">Select Company</Label>
                  <select
                    id="company"
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full h-12 sm:h-10 rounded-lg border border-border bg-background px-4 text-base sm:text-sm appearance-none cursor-pointer hover:border-accent/50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@company.com"
                      value={credentials.email}
                      onChange={(e) => setCredentials((p) => ({ ...p, email: e.target.value }))}
                      required
                      className="h-12 sm:h-10 pl-4 pr-10 text-base sm:text-sm"
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setCredentials((p) => ({ ...p, password: e.target.value }))}
                      required
                      className="h-12 sm:h-10 pl-4 pr-10 text-base sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} size="lg" className="w-full h-12 sm:h-10 gap-2 text-base sm:text-sm">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login <LogIn className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="text-center pt-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {"Don't have a company account? "}
                    <Link href="/register/company" className="text-accent hover:text-accent/80 font-medium">
                      Register here
                    </Link>
                  </p>
                </div>
              </>
            )}
          </form>
        </div>
      </main>
    </div>
  )
}
