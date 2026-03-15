"use client"

import { useState } from "react"
import {
  Shield,
  AlertTriangle,
  Copy,
  Wifi,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type AlertType = "duplicate_ip" | "unknown_device" | "unauthorized_ssid"
type AlertSeverity = "critical" | "high" | "medium" | "low"
type AlertStatus = "active" | "investigating" | "resolved" | "dismissed"

interface SecurityAlert {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  description: string
  device?: string
  mac?: string
  ip?: string
  ssid?: string
  timestamp: string
  status: AlertStatus
  details: string
}

const alerts: SecurityAlert[] = [
  {
    id: "1",
    type: "duplicate_ip",
    severity: "critical",
    title: "Duplicate IP Address Detected",
    description: "Two devices are using the same IP address on CORP-MAIN network",
    device: "Unknown Device",
    mac: "XX:XX:XX:XX:XX:01",
    ip: "192.168.1.45",
    ssid: "CORP-MAIN",
    timestamp: "2025-12-15T14:30:00",
    status: "active",
    details: "IP conflict detected between registered device (MacBook Pro - Ahmed Al-Rashid) and unknown device. This could indicate IP spoofing or DHCP misconfiguration. Immediate investigation recommended."
  },
  {
    id: "2",
    type: "unknown_device",
    severity: "high",
    title: "Unregistered Device Connected",
    description: "An unknown device has connected to the corporate network",
    device: "Unknown Device",
    mac: "AA:BB:CC:11:22:33",
    ip: "192.168.1.178",
    ssid: "CORP-SECURE",
    timestamp: "2025-12-15T13:45:00",
    status: "investigating",
    details: "Device with unregistered MAC address has gained access to CORP-SECURE network. This device has not been registered in RishadNet and may pose a security risk. Device fingerprinting suggests it may be a Linux-based system."
  },
  {
    id: "3",
    type: "unauthorized_ssid",
    severity: "high",
    title: "Unauthorized SSID Access Attempt",
    description: "Registered device attempted to access restricted network",
    device: "iPhone 15 Pro",
    mac: "DD:EE:FF:44:55:66",
    ip: "N/A",
    ssid: "RESTRICTED",
    timestamp: "2025-12-15T12:20:00",
    status: "active",
    details: "Device registered to Sarah Khan (Marketing) attempted to connect to RESTRICTED network, which is only authorized for IT department personnel. Multiple connection attempts detected within 5 minutes."
  },
  {
    id: "4",
    type: "duplicate_ip",
    severity: "medium",
    title: "IP Address Conflict",
    description: "Potential IP conflict on guest network",
    device: "Guest Device",
    mac: "11:22:33:44:55:66",
    ip: "10.0.0.50",
    ssid: "CORP-GUEST",
    timestamp: "2025-12-15T11:00:00",
    status: "resolved",
    details: "Temporary IP conflict resolved automatically by DHCP server. Both devices have been assigned new IP addresses. No further action required."
  },
  {
    id: "5",
    type: "unknown_device",
    severity: "low",
    title: "New IoT Device Detected",
    description: "Unregistered IoT device on designated IoT network",
    device: "IoT Device",
    mac: "77:88:99:AA:BB:CC",
    ip: "192.168.100.15",
    ssid: "IOT-NETWORK",
    timestamp: "2025-12-15T09:30:00",
    status: "dismissed",
    details: "New smart thermostat detected on IoT network. Device appears to be a legitimate Nest device. Recommend adding to registry during next maintenance window."
  },
]

const alertTypeIcons: Record<AlertType, typeof Shield> = {
  duplicate_ip: Copy,
  unknown_device: AlertTriangle,
  unauthorized_ssid: Wifi,
}

const alertTypeLabels: Record<AlertType, string> = {
  duplicate_ip: "Duplicate IP",
  unknown_device: "Unknown Device",
  unauthorized_ssid: "Unauthorized SSID",
}

const severityStyles: Record<AlertSeverity, { bg: string; text: string; border: string }> = {
  critical: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30" },
  high: { bg: "bg-chart-4/10", text: "text-chart-4", border: "border-chart-4/30" },
  medium: { bg: "bg-chart-3/10", text: "text-chart-3", border: "border-chart-3/30" },
  low: { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" },
}

const statusStyles: Record<AlertStatus, { bg: string; text: string }> = {
  active: { bg: "bg-destructive/10", text: "text-destructive" },
  investigating: { bg: "bg-chart-3/10", text: "text-chart-3" },
  resolved: { bg: "bg-accent/10", text: "text-accent" },
  dismissed: { bg: "bg-muted", text: "text-muted-foreground" },
}

export default function AlertsPage() {
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set())
  const [alertStatuses, setAlertStatuses] = useState<Record<string, AlertStatus>>(
    Object.fromEntries(alerts.map(a => [a.id, a.status]))
  )

  const toggleAlert = (id: string) => {
    const newExpanded = new Set(expandedAlerts)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedAlerts(newExpanded)
  }

  const updateStatus = (id: string, status: AlertStatus) => {
    setAlertStatuses(prev => ({ ...prev, [id]: status }))
  }

  const activeCount = Object.values(alertStatuses).filter(s => s === "active" || s === "investigating").length
  const resolvedCount = Object.values(alertStatuses).filter(s => s === "resolved" || s === "dismissed").length

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Security Alerts</h1>
        <p className="text-sm text-muted-foreground">Monitor and respond to network security events</p>
      </div>

      {/* Stats - Horizontal scroll on mobile */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <Card>
            <CardContent className="pt-4 sm:pt-6 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                  <p className="text-xl sm:text-3xl font-bold">{alerts.length}</p>
                </div>
                <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-xl bg-secondary flex items-center justify-center self-start sm:self-auto">
                  <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-both"
        >
          <Card>
            <CardContent className="pt-4 sm:pt-6 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
                  <p className="text-xl sm:text-3xl font-bold text-destructive">{activeCount}</p>
                </div>
                <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-xl bg-destructive/10 flex items-center justify-center self-start sm:self-auto">
                  <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-both"
        >
          <Card>
            <CardContent className="pt-4 sm:pt-6 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Resolved</p>
                  <p className="text-xl sm:text-3xl font-bold text-accent">{resolvedCount}</p>
                </div>
                <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-xl bg-accent/10 flex items-center justify-center self-start sm:self-auto">
                  <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 sm:space-y-4">
        {alerts.map((alert, index) => {
          const AlertIcon = alertTypeIcons[alert.type]
          const currentStatus = alertStatuses[alert.id]
          const isExpanded = expandedAlerts.has(alert.id)

          return (
            <div
              key={alert.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
            >
              <Card className={`border-l-4 ${severityStyles[alert.severity].border} overflow-hidden`}>
                {/* Header - Always visible, tap to expand */}
                <button
                  onClick={() => toggleAlert(alert.id)}
                  className="w-full text-left touch-manipulation"
                >
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl ${severityStyles[alert.severity].bg} flex items-center justify-center flex-shrink-0`}>
                          <AlertIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${severityStyles[alert.severity].text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm sm:text-base leading-tight">{alert.title}</CardTitle>
                          <CardDescription className="mt-1 text-xs sm:text-sm line-clamp-2">{alert.description}</CardDescription>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={`${severityStyles[alert.severity].bg} ${severityStyles[alert.severity].text} border-0 text-[10px] sm:text-xs`}>
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline" className={`${statusStyles[currentStatus].bg} ${statusStyles[currentStatus].text} border-0 text-[10px] sm:text-xs`}>
                          {currentStatus}
                        </Badge>
                        <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <CardContent className="pt-0 space-y-4 sm:space-y-6">
                      {/* Details */}
                      <div className="rounded-xl bg-secondary/50 p-3 sm:p-4">
                        <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{alert.details}</p>
                      </div>

                      {/* Alert Info Grid */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] sm:text-xs text-muted-foreground">Alert Type</p>
                          <p className="text-xs sm:text-sm font-medium">{alertTypeLabels[alert.type]}</p>
                        </div>
                        {alert.device && (
                          <div className="space-y-1">
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Device</p>
                            <p className="text-xs sm:text-sm font-medium truncate">{alert.device}</p>
                          </div>
                        )}
                        {alert.mac && (
                          <div className="space-y-1">
                            <p className="text-[10px] sm:text-xs text-muted-foreground">MAC Address</p>
                            <code className="text-xs font-mono bg-secondary px-1.5 sm:px-2 py-0.5 rounded block truncate">{alert.mac}</code>
                          </div>
                        )}
                        {alert.ip && (
                          <div className="space-y-1">
                            <p className="text-[10px] sm:text-xs text-muted-foreground">IP Address</p>
                            <code className="text-xs font-mono bg-secondary px-1.5 sm:px-2 py-0.5 rounded">{alert.ip}</code>
                          </div>
                        )}
                        {alert.ssid && (
                          <div className="space-y-1">
                            <p className="text-[10px] sm:text-xs text-muted-foreground">SSID</p>
                            <p className="text-xs sm:text-sm font-medium">{alert.ssid}</p>
                          </div>
                        )}
                        <div className="space-y-1">
                          <p className="text-[10px] sm:text-xs text-muted-foreground">Date & Time</p>
                          <p className="text-xs sm:text-sm font-medium">
                            {new Date(alert.timestamp).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Actions - Full width buttons on mobile */}
                      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 pt-2 border-t border-border">
                        {currentStatus === "active" && (
                          <>
                            <Button
                              size="sm"
                              className="gap-2 h-10 sm:h-9 flex-1 sm:flex-none"
                              onClick={() => updateStatus(alert.id, "investigating")}
                            >
                              <Eye className="h-4 w-4" />
                              Investigate
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 h-10 sm:h-9 flex-1 sm:flex-none"
                              onClick={() => updateStatus(alert.id, "resolved")}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Mark Resolved
                            </Button>
                          </>
                        )}
                        {currentStatus === "investigating" && (
                          <>
                            <Button
                              size="sm"
                              className="gap-2 h-10 sm:h-9 flex-1 sm:flex-none"
                              onClick={() => updateStatus(alert.id, "resolved")}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Mark Resolved
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 h-10 sm:h-9 flex-1 sm:flex-none"
                              onClick={() => updateStatus(alert.id, "active")}
                            >
                              Back to Active
                            </Button>
                          </>
                        )}
                        {(currentStatus === "resolved" || currentStatus === "dismissed") && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 h-10 sm:h-9 flex-1 sm:flex-none"
                            onClick={() => updateStatus(alert.id, "active")}
                          >
                            Reopen Alert
                          </Button>
                        )}
                        {currentStatus !== "dismissed" && currentStatus !== "resolved" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-2 h-10 sm:h-9 text-muted-foreground flex-1 sm:flex-none"
                            onClick={() => updateStatus(alert.id, "dismissed")}
                          >
                            <XCircle className="h-4 w-4" />
                            Dismiss
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </div>
                )}
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
