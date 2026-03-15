"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Network,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Building2,
  User,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "sonner"

const steps = [
  { id: 1, title: "Company Info", icon: Building2 },
  { id: 2, title: "Admin Account", icon: User },
  { id: 3, title: "Verification", icon: CheckCircle2 },
]

export default function CompanyRegistrationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [companyData, setCompanyData] = useState({
    companyName: "",
    industry: "",
    companyEmail: "",
    website: "",
    phone: "",
  })

  const [adminData, setAdminData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })

  const clearError = (field: string) =>
    setFieldErrors((prev) => { const n = { ...prev }; delete n[field]; return n })

  const handleCompanyChange = (field: string, value: string) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }))
    clearError(field)
  }

  const handleAdminChange = (field: string, value: string) => {
    setAdminData((prev) => ({ ...prev, [field]: value }))
    clearError(field)
  }

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {}

    if (step === 1) {
      if (!companyData.companyName) errors.companyName = "Company name is required"
      if (!companyData.companyEmail) errors.companyEmail = "Company email is required"
      else if (!companyData.companyEmail.includes("@")) errors.companyEmail = "Please enter a valid email"
      if (!companyData.phone) errors.phone = "Phone number is required"
    }

    if (step === 2) {
      if (!adminData.fullName) errors.fullName = "Full name is required"
      if (!adminData.email) errors.email = "Email is required"
      else if (!adminData.email.includes("@")) errors.email = "Please enter a valid email"
      if (!adminData.password) errors.password = "Password is required"
      else if (adminData.password.length < 8) errors.password = "Password must be at least 8 characters"
      if (!adminData.confirmPassword) errors.confirmPassword = "Please confirm password"
      else if (adminData.password !== adminData.confirmPassword) errors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      toast.error(Object.values(errors)[0])
      return false
    }
    return true
  }

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep(currentStep + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyData.companyName,
          industry: companyData.industry,
          companyEmail: companyData.companyEmail,
          website: companyData.website,
          phone: companyData.phone,
          fullName: adminData.fullName,
          adminEmail: adminData.email,
          password: adminData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Registration failed")
        return
      }

      setIsSuccess(true)
      toast.success("Company registered successfully!")
    } catch (err) {
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 safe-area-inset">
        <div
          className="max-w-md w-full text-center px-4 animate-in fade-in zoom-in-95 duration-500"
        >
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-accent" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">Registration Complete</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-2">
            Your company has been registered. You can now log in with{" "}
            <span className="font-semibold text-foreground">{adminData.email}</span> and your password.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mb-8">
            Select your company from the dropdown on the login page.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/login" className="block">
              <Button size="lg" className="w-full h-12 text-base gap-2">
                Go to Login <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" size="lg" className="w-full h-12 text-base">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
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

      <main className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8 pb-8 safe-area-inset-bottom">
        <div className="mx-auto max-w-2xl">
          {/* Progress Steps */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep
                const isCompleted = step.id < currentStep
                return (
                  <div key={step.id} className="flex flex-1 items-center gap-2 sm:gap-3">
                    <div
                      className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${isCompleted
                        ? "bg-accent text-accent-foreground"
                        : isActive
                          ? "bg-accent/20 text-accent border-2 border-accent"
                          : "bg-secondary text-muted-foreground"
                        }`}
                    >
                      {isCompleted ? <Check className="h-5 w-5 sm:h-6 sm:w-6" /> : step.id}
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs sm:text-sm font-medium">{step.title}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-1 rounded-full transition-colors ${step.id < currentStep ? "bg-accent" : "bg-secondary"}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div
            key={currentStep}
            className="text-center mb-8 sm:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {currentStep === 1 && "Register Your Company"}
              {currentStep === 2 && "Create Admin Account"}
              {currentStep === 3 && "Review & Confirm"}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              {currentStep === 1 && "Tell us about your organization"}
              {currentStep === 2 && "Set up your admin credentials"}
              {currentStep === 3 && "Verify your information before submission"}
            </p>
          </div>

          <form
            key={`step-${currentStep}`}
            onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext() }}
            className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100"
          >
            {currentStep === 1 && (
              <div
                className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
              >
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    value={companyData.companyName}
                    onChange={(e) => handleCompanyChange("companyName", e.target.value)}
                    className={`h-12 sm:h-10 text-base sm:text-sm ${fieldErrors.companyName ? "border-destructive" : ""}`}
                  />
                  {fieldErrors.companyName && <p className="text-xs text-destructive">{fieldErrors.companyName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm">Industry/Sector</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Technology, Finance, Healthcare"
                    value={companyData.industry}
                    onChange={(e) => handleCompanyChange("industry", e.target.value)}
                    className="h-12 sm:h-10 text-base sm:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail" className="text-sm">Company Email *</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    placeholder="info@company.com"
                    value={companyData.companyEmail}
                    onChange={(e) => handleCompanyChange("companyEmail", e.target.value)}
                    className={`h-12 sm:h-10 text-base sm:text-sm ${fieldErrors.companyEmail ? "border-destructive" : ""}`}
                  />
                  {fieldErrors.companyEmail && <p className="text-xs text-destructive">{fieldErrors.companyEmail}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://company.com"
                    value={companyData.website}
                    onChange={(e) => handleCompanyChange("website", e.target.value)}
                    className="h-12 sm:h-10 text-base sm:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+966 5XX XXX XXXX"
                    value={companyData.phone}
                    onChange={(e) => handleCompanyChange("phone", e.target.value)}
                    className={`h-12 sm:h-10 text-base sm:text-sm ${fieldErrors.phone ? "border-destructive" : ""}`}
                  />
                  {fieldErrors.phone && <p className="text-xs text-destructive">{fieldErrors.phone}</p>}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div
                className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
              >
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={adminData.fullName}
                    onChange={(e) => handleAdminChange("fullName", e.target.value)}
                    className={`h-12 sm:h-10 text-base sm:text-sm ${fieldErrors.fullName ? "border-destructive" : ""}`}
                  />
                  {fieldErrors.fullName && <p className="text-xs text-destructive">{fieldErrors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail" className="text-sm">Admin Email *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="admin@company.com"
                    value={adminData.email}
                    onChange={(e) => handleAdminChange("email", e.target.value)}
                    className={`h-12 sm:h-10 text-base sm:text-sm ${fieldErrors.email ? "border-destructive" : ""}`}
                  />
                  {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminPhone" className="text-sm">Phone Number</Label>
                  <Input
                    id="adminPhone"
                    type="tel"
                    placeholder="+966 5XX XXX XXXX"
                    value={adminData.phone}
                    onChange={(e) => handleAdminChange("phone", e.target.value)}
                    className="h-12 sm:h-10 text-base sm:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={adminData.password}
                    onChange={(e) => handleAdminChange("password", e.target.value)}
                    className={`h-12 sm:h-10 text-base sm:text-sm ${fieldErrors.password ? "border-destructive" : ""}`}
                  />
                  {fieldErrors.password ? (
                    <p className="text-xs text-destructive">{fieldErrors.password}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">At least 8 characters</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={adminData.confirmPassword}
                    onChange={(e) => handleAdminChange("confirmPassword", e.target.value)}
                    className={`h-12 sm:h-10 text-base sm:text-sm ${fieldErrors.confirmPassword ? "border-destructive" : ""}`}
                  />
                  {fieldErrors.confirmPassword && <p className="text-xs text-destructive">{fieldErrors.confirmPassword}</p>}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div
                className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
              >
                <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-accent" />
                    Company Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Company Name</p>
                      <p className="font-medium text-sm mt-1">{companyData.companyName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Industry</p>
                      <p className="font-medium text-sm mt-1">{companyData.industry || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium text-sm mt-1">{companyData.companyEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium text-sm mt-1">{companyData.phone}</p>
                    </div>
                    {companyData.website && (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-muted-foreground">Website</p>
                        <p className="font-medium text-sm mt-1">{companyData.website}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-accent" />
                    Admin Account
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Full Name</p>
                      <p className="font-medium text-sm mt-1">{adminData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium text-sm mt-1">{adminData.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Password</p>
                      <p className="font-medium text-sm mt-1">{"•".repeat(adminData.password.length)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="font-medium text-sm mt-1">Administrator</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-accent/5 border border-accent/20 p-4">
                  <p className="text-sm text-muted-foreground">
                    By registering, you confirm that all information provided is accurate. You will use your admin email and password to log in.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 h-12 text-base"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="flex-1 h-12 text-base gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : currentStep === 3 ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Complete Registration
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {currentStep === 1 && (
              <div className="text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-accent hover:text-accent/80 font-medium">
                    Login here
                  </Link>
                </p>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  )
}
