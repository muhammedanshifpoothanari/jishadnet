'use client'

import { useState } from 'react'
import {
  Network,
  Activity,
  AlertTriangle,
  Wifi,
  BarChart3,
  Download,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NetworkMap } from '@/components/network-map'
import { toast } from 'sonner'



const networkStats = [
  {
    label: 'Total Devices',
    value: '247',
    change: '+12 this week',
    icon: Network,
    color: 'text-blue-500',
  },
  {
    label: 'Online Now',
    value: '198',
    change: '80.2% uptime',
    icon: Activity,
    color: 'text-green-500',
  },
  {
    label: 'Offline',
    value: '23',
    change: '-5 since yesterday',
    icon: Wifi,
    color: 'text-gray-500',
  },
  {
    label: 'Suspicious',
    value: '4',
    change: '+2 alerts',
    icon: AlertTriangle,
    color: 'text-red-500',
  },
]

export default function NetworkMapPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success('Network map refreshed')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleExportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      stats: networkStats,
      exported: 'Network Topology Report',
    }
    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

    const exportFileDefaultName = `network-topology-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()

    toast.success('Network data exported successfully')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <div>
          <h1 className="text-3xl font-bold">Network Map</h1>
          <p className="text-muted-foreground mt-2">
            Visualize and monitor your network topology in real-time
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="gap-2 flex-1 sm:flex-none"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleExportData}
            variant="outline"
            className="gap-2 flex-1 sm:flex-none"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {networkStats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div
              key={idx}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "both" }}
            >
              <Card className="hover:border-accent/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Network Visualization */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-both">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Network Topology</CardTitle>
                <CardDescription>
                  Interactive map of your connected devices. Click to select, drag to pan, scroll to zoom.
                </CardDescription>
              </div>
              <div className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">
                Live
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <NetworkMap />
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[600ms] fill-both">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { color: '#10b981', label: 'Online', icon: '●' },
                { color: '#6b7280', label: 'Offline', icon: '●' },
                { color: '#ef4444', label: 'Suspicious', icon: '●' },
                { color: '#6366f1', label: 'Connection', icon: '─' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span style={{ color: item.color }} className="text-xl">
                    {item.icon}
                  </span>
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[700ms] fill-both"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Monitor real-time bandwidth usage and device performance metrics.
            </p>
            <p>
              Set up alerts for suspicious activities and offline devices.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Review unidentified devices and manage network access policies.
            </p>
            <p>
              Enable enhanced security features for critical network segments.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
