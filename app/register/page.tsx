"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Network,
  ArrowLeft,
  Laptop,
  Smartphone,
  Tablet,
  Router,
  CheckCircle2,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"

const deviceTypes = [
  { value: "laptop", label: "Laptop", icon: Laptop },
  { value: "phone", label: "Phone", icon: Smartphone },
  { value: "tablet", label: "Tablet", icon: Tablet },
  { value: "iot", label: "IoT Device", icon: Router },
]

const departments = [
  "Engineering",
  "Finance",
  "Human Resources",
  "Marketing",
  "Operations",
  "Sales",
  "IT",
  "Executive",
  "Other"
]

const ssids = [
  "CORP-MAIN",
  "CORP-GUEST",
  "CORP-SECURE",
  "IOT-NETWORK",
  "RESTRICTED"
]

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>("")
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    department: "",
    deviceType: "",
    macAddress: "",
    ip1: "",
    ip2: "",
    ssid: "",
    notes: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field === "deviceType") {
      setSelectedDeviceType(value)
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
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Device Registered Successfully</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
            Your device registration request has been submitted.
            You will receive a confirmation once approved.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full h-12 text-base"
              onClick={() => {
                setIsSuccess(false);
                setFormData({ fullName: "", phone: "", department: "", deviceType: "", macAddress: "", ip1: "", ip2: "", ssid: "", notes: "" });
                setSelectedDeviceType("");
              }}
            >
              Register Another Device
            </Button>
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
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors touch-manipulation p-2 -ml-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm hidden sm:inline">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-accent flex items-center justify-center">
                <Network className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-semibold tracking-tight">RishadNet</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8 pb-8 safe-area-inset-bottom">
        <div className="mx-auto max-w-2xl">
          <div
            className="text-center mb-6 sm:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Device Registration</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Register your device to access the corporate network
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100"
          >
            {/* Personal Information */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Personal Information</h2>
              <div className="grid gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    required
                    className="h-12 sm:h-10 text-base sm:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+966 5XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    className="h-12 sm:h-10 text-base sm:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleInputChange("department", value)}
                  >
                    <SelectTrigger className="h-12 sm:h-10 text-base sm:text-sm">
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept.toLowerCase()} className="py-3 sm:py-2">
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Device Information */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Device Information</h2>

              {/* Device Type Selection - Mobile optimized grid */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <Label className="text-sm">Device Type</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                  {deviceTypes.map((device) => (
                    <button
                      key={device.value}
                      type="button"
                      onClick={() => handleInputChange("deviceType", device.value)}
                      className={`flex flex-col items-center gap-2 p-4 sm:p-4 rounded-xl border transition-all touch-manipulation active:scale-95 ${selectedDeviceType === device.value
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-secondary/50 hover:border-accent/50 active:bg-secondary"
                        }`}
                    >
                      <device.icon className="h-6 w-6 sm:h-6 sm:w-6" />
                      <span className="text-sm font-medium">{device.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="macAddress" className="text-sm">MAC Address</Label>
                  <Input
                    id="macAddress"
                    placeholder="XX:XX:XX:XX:XX:XX"
                    value={formData.macAddress}
                    onChange={(e) => handleInputChange("macAddress", e.target.value)}
                    required
                    className="font-mono h-12 sm:h-10 text-base sm:text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Find this in your device&apos;s network settings
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ip1" className="text-sm">IP Address 1</Label>
                    <Input
                      id="ip1"
                      placeholder="192.168.1.XXX"
                      value={formData.ip1}
                      onChange={(e) => handleInputChange("ip1", e.target.value)}
                      className="font-mono h-12 sm:h-10 text-base sm:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ip2" className="text-sm">IP Address 2 (Optional)</Label>
                    <Input
                      id="ip2"
                      placeholder="10.0.0.XXX"
                      value={formData.ip2}
                      onChange={(e) => handleInputChange("ip2", e.target.value)}
                      className="font-mono h-12 sm:h-10 text-base sm:text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ssid" className="text-sm">SSID</Label>
                  <Select
                    value={formData.ssid}
                    onValueChange={(value) => handleInputChange("ssid", value)}
                  >
                    <SelectTrigger className="h-12 sm:h-10 text-base sm:text-sm">
                      <SelectValue placeholder="Select network SSID" />
                    </SelectTrigger>
                    <SelectContent>
                      {ssids.map((ssid) => (
                        <SelectItem key={ssid} value={ssid} className="py-3 sm:py-2">
                          {ssid}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Additional Notes</h2>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about this device registration..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                  className="text-base sm:text-sm resize-none"
                />
              </div>
            </div>

            {/* Submit - Full width on mobile */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-end pt-2">
              <Link href="/" className="block">
                <Button type="button" variant="outline" size="lg" className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting} size="lg" className="w-full sm:w-auto gap-2 h-12 sm:h-10 text-base sm:text-sm">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
