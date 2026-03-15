"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Monitor,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface Stats {
  total: number
  active: number
  pending: number
  flagged: number
  byType: { type: string; count: number }[]
  recentDevices: {
    id: string
    user: string
    deviceType: string
    status: string
    mac: string
    createdAt: string
  }[]
}

const TYPE_COLORS: Record<string, string> = {
  laptop: "var(--color-chart-1)",
  phone: "var(--color-chart-2)",
  tablet: "var(--color-chart-3)",
  iot: "var(--color-chart-4)",
}

const registrationPlaceholder = [
  { date: "Jan", devices: 0 },
  { date: "Feb", devices: 0 },
  { date: "Mar", devices: 0 },
  { date: "Apr", devices: 0 },
  { date: "May", devices: 0 },
  { date: "Jun", devices: 0 },
  { date: "Jul", devices: 0 },
  { date: "Aug", devices: 0 },
  { date: "Sep", devices: 0 },
  { date: "Oct", devices: 0 },
  { date: "Nov", devices: 0 },
  { date: "Dec", devices: 0 },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats
    ? [
      { name: "Total Devices", value: stats.total, icon: Monitor, description: "Registered devices" },
      { name: "Active", value: stats.active, icon: Wifi, description: "Active devices" },
      { name: "Pending", value: stats.pending, icon: Clock, description: "Awaiting approval" },
      { name: "Flagged", value: stats.flagged, icon: AlertTriangle, description: "Require attention" },
    ]
    : []

  const pieData = stats?.byType.map((d) => ({
    name: d.type.charAt(0).toUpperCase() + d.type.slice(1),
    value: d.count,
    fill: TYPE_COLORS[d.type] || "var(--color-chart-5)",
  })) ?? []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 lg:pt-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Monitor your network devices and security status</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <div
            key={stat.name}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
          >
            <Card className="relative overflow-hidden h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 space-y-0">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.name}
                </CardTitle>
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg bg-secondary flex items-center justify-center">
                  <stat.icon className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl sm:text-3xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.description}</div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Device Types Pie Chart */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400 fill-both">
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Device Types</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Distribution by device category</CardDescription>
            </CardHeader>
            <CardContent>
              {pieData.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  No devices registered yet
                </div>
              ) : (
                <div className="h-[200px] sm:h-[260px] flex flex-col sm:flex-row items-center gap-4">
                  <ResponsiveContainer width="100%" height="100%" className="flex-1">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) =>
                          active && payload?.length ? (
                            <div className="rounded-lg border border-border bg-background p-2 shadow-lg">
                              <p className="font-medium text-sm">{payload[0].name}</p>
                              <p className="text-xs text-muted-foreground">{payload[0].value} devices</p>
                            </div>
                          ) : null
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center sm:flex-col gap-2 sm:gap-3">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
                        <span className="text-xs text-muted-foreground">{item.name}</span>
                        <span className="text-xs font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Registrations Over Time */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-both">
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Device Registrations</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Monthly device activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] sm:h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={registrationPlaceholder}>
                    <defs>
                      <linearGradient id="colorDevices" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={30} />
                    <Tooltip
                      content={({ active, payload }) =>
                        active && payload?.length ? (
                          <div className="rounded-lg border border-border bg-background p-2 shadow-lg">
                            <p className="font-medium text-sm">{payload[0].payload.date}</p>
                            <p className="text-xs text-muted-foreground">{payload[0].value} devices</p>
                          </div>
                        ) : null
                      }
                    />
                    <Area type="monotone" dataKey="devices" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#colorDevices)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Getting Started Checklist */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[600ms] fill-both">
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Getting Started</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Complete these steps to set up your network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { completed: true, title: "Create Company Account", description: "Company registered and admin setup complete" },
                { completed: true, title: "Admin Account Setup", description: "You are logged in as admin" },
                { completed: (stats?.total ?? 0) > 0, title: "Register Your First Device", description: "Add at least one device to monitor", href: "/admin/devices" },
                { completed: false, title: "Configure Security Policies", description: "Set up access controls and alerts", href: "/admin/settings" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${item.completed ? "border-accent/30 bg-accent/5" : "border-border"
                    }`}
                >
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.completed ? "bg-accent text-accent-foreground" : "border border-border"
                    }`}>
                    {item.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  {item.href && !item.completed && (
                    <Link href={item.href} className="flex-shrink-0 text-accent hover:text-accent/80 text-xs font-medium">
                      Go →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Devices */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[700ms] fill-both">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-4">
            <div>
              <CardTitle className="text-base sm:text-lg">Recent Registrations</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Latest device activity</CardDescription>
            </div>
            <Link href="/admin/devices" className="text-xs sm:text-sm text-accent hover:underline flex items-center gap-1">
              <span className="hidden sm:inline">View all</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {!stats?.recentDevices.length ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No devices yet.{" "}
                <Link href="/admin/devices" className="text-accent hover:underline">
                  Add your first device.
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentDevices.map((device) => (
                  <Link
                    key={device.id}
                    href={`/admin/devices/${device.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{device.user}</p>
                        <p className="text-xs text-muted-foreground truncate capitalize">{device.deviceType} &bull; {device.mac}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${device.status === "active"
                      ? "bg-accent/10 text-accent"
                      : device.status === "pending"
                        ? "bg-chart-3/10 text-chart-3"
                        : "bg-destructive/10 text-destructive"
                      }`}>
                      {device.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
