"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Monitor,
  User,
  Phone,
  Building,
  Wifi,
  Globe,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Shield,
  Activity,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock device data
const deviceData: Record<string, {
  id: string
  user: string
  email: string
  phone: string
  department: string
  deviceName: string
  deviceType: string
  mac: string
  ip1: string
  ip2: string
  ssid: string
  status: "active" | "pending" | "flagged" | "blocked"
  registeredDate: string
  lastSeen: string
  notes: string
  history: { action: string; date: string; by: string }[]
}> = {
  "1": {
    id: "1",
    user: "Ahmed Al-Rashid",
    email: "ahmed.rashid@company.sa",
    phone: "+966 5XX XXX 1234",
    department: "Engineering",
    deviceName: "MacBook Pro 16\"",
    deviceType: "laptop",
    mac: "AA:BB:CC:DD:EE:01",
    ip1: "192.168.1.101",
    ip2: "10.0.0.101",
    ssid: "CORP-MAIN",
    status: "active",
    registeredDate: "2025-12-01T09:30:00",
    lastSeen: "2025-12-15T14:22:00",
    notes: "Primary work device. Previously registered under old network.",
    history: [
      { action: "Device approved", date: "2025-12-01T10:15:00", by: "Admin User" },
      { action: "IP address updated", date: "2025-12-05T11:30:00", by: "System" },
      { action: "SSID changed to CORP-MAIN", date: "2025-12-10T09:00:00", by: "Admin User" },
      { action: "Security scan completed", date: "2025-12-14T16:45:00", by: "System" },
    ]
  }
}

// Default device for any ID
const defaultDevice = {
  id: "default",
  user: "Sample User",
  email: "user@company.sa",
  phone: "+966 5XX XXX 0000",
  department: "IT Department",
  deviceName: "Device",
  deviceType: "laptop",
  mac: "AA:BB:CC:DD:EE:FF",
  ip1: "192.168.1.100",
  ip2: "10.0.0.100",
  ssid: "CORP-MAIN",
  status: "active" as const,
  registeredDate: "2025-12-01T09:30:00",
  lastSeen: "2025-12-15T14:22:00",
  notes: "Sample device registration.",
  history: [
    { action: "Device registered", date: "2025-12-01T09:30:00", by: "User" },
    { action: "Device approved", date: "2025-12-01T10:15:00", by: "Admin User" },
  ]
}

const statusStyles: Record<string, { bg: string; text: string; icon: typeof CheckCircle }> = {
  active: { bg: "bg-accent/10", text: "text-accent", icon: CheckCircle },
  pending: { bg: "bg-chart-3/10", text: "text-chart-3", icon: Clock },
  flagged: { bg: "bg-destructive/10", text: "text-destructive", icon: Shield },
  blocked: { bg: "bg-muted", text: "text-muted-foreground", icon: XCircle },
}

export default function DeviceDetailPage() {
  const params = useParams()
  const id = params.id as string
  const device = deviceData[id] || defaultDevice
  const [currentStatus, setCurrentStatus] = useState(device.status)

  const StatusIcon = statusStyles[currentStatus].icon

  const handleStatusChange = (newStatus: "active" | "blocked") => {
    setCurrentStatus(newStatus)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/admin/devices">
            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-9 sm:w-9 flex-shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight truncate">{device.deviceName}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono truncate">{device.mac}</p>
          </div>
          <Badge
            variant="outline"
            className={`${statusStyles[currentStatus].bg} ${statusStyles[currentStatus].text} border-0 gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm flex-shrink-0`}
          >
            <StatusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}</span>
          </Badge>
        </div>
      </div>

      {/* Quick Actions - Mobile optimized */}
      <div
        className="flex flex-wrap gap-2 sm:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        {currentStatus !== "active" && (
          <Button onClick={() => handleStatusChange("active")} className="gap-2 flex-1 sm:flex-none h-10 sm:h-9 text-sm">
            <CheckCircle className="h-4 w-4" />
            <span className="sm:inline">Approve</span>
          </Button>
        )}
        {currentStatus !== "blocked" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2 flex-1 sm:flex-none h-10 sm:h-9 text-sm">
                <XCircle className="h-4 w-4" />
                <span className="sm:inline">Block</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Block this device?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will immediately revoke network access for this device.
                  The user will need to re-register and request approval.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                <AlertDialogCancel className="h-11 sm:h-10">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleStatusChange("blocked")} className="h-11 sm:h-10">
                  Block Device
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <Button variant="outline" className="gap-2 h-10 sm:h-9 text-sm">
          <Edit className="h-4 w-4" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10 sm:h-9 sm:w-9 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this device?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The device will be permanently
                removed from the system and all history will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <AlertDialogCancel className="h-11 sm:h-10">Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90 h-11 sm:h-10">
                Delete Device
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Mobile: Stacked layout, Desktop: Grid layout */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main content */}
        <div
          className="lg:col-span-2 space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-both"
        >
          {/* Device Info - Mobile summary card */}
          <Card className="lg:hidden">
            <CardContent className="pt-4 pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Device</p>
                  <p className="text-sm font-medium capitalize">{device.deviceType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">SSID</p>
                  <p className="text-sm font-medium">{device.ssid}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Registered</p>
                  <p className="text-sm font-medium">
                    {new Date(device.registeredDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Last Seen</p>
                  <p className="text-sm font-medium">
                    {new Date(device.lastSeen).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Details */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                User Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <p className="text-xs sm:text-sm text-muted-foreground">Full Name</p>
                <p className="text-sm sm:text-base font-medium">{device.user}</p>
              </div>
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <p className="text-xs sm:text-sm text-muted-foreground">Email</p>
                <p className="text-sm sm:text-base font-medium truncate">{device.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Phone
                </p>
                <p className="text-sm sm:text-base font-medium">{device.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5" /> Department
                </p>
                <p className="text-sm sm:text-base font-medium">{device.department}</p>
              </div>
            </CardContent>
          </Card>

          {/* Network Details */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                Network Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <p className="text-xs sm:text-sm text-muted-foreground">MAC Address</p>
                <code className="font-mono text-xs sm:text-sm bg-secondary px-2 py-1 rounded block truncate">{device.mac}</code>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                  <Wifi className="h-3.5 w-3.5" /> SSID
                </p>
                <p className="text-sm sm:text-base font-medium">{device.ssid}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">Primary IP</p>
                <code className="font-mono text-xs sm:text-sm bg-secondary px-2 py-1 rounded">{device.ip1}</code>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">Secondary IP</p>
                <code className="font-mono text-xs sm:text-sm bg-secondary px-2 py-1 rounded">{device.ip2 || "N/A"}</code>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{device.notes}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div
          className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-both"
        >
          {/* Device Info - Desktop only */}
          <Card className="hidden lg:block">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-muted-foreground" />
                Device Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Device Name</p>
                <p className="font-medium">{device.deviceName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Device Type</p>
                <p className="font-medium capitalize">{device.deviceType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Registered
                </p>
                <p className="font-medium">
                  {new Date(device.registeredDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Last Seen
                </p>
                <p className="font-medium">
                  {new Date(device.lastSeen).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Activity History */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                Activity Log
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Recent device activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {device.history.map((item, index) => (
                  <div key={index} className="relative pl-4 pb-3 sm:pb-4 last:pb-0 border-l border-border last:border-l-transparent">
                    <div className="absolute left-0 top-0.5 -translate-x-1/2 h-2 w-2 rounded-full bg-accent" />
                    <p className="text-xs sm:text-sm font-medium">{item.action}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                      {new Date(item.date).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })} by {item.by}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
