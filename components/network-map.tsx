'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Monitor,
  Smartphone,
  Tablet,
  Router,
  Radio,
  ChevronDown,
  Search,
  Filter,
  Download,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface Device {
  id: string
  name: string
  type: 'laptop' | 'phone' | 'tablet' | 'iot' | 'router'
  ip: string
  mac: string
  status: 'online' | 'offline' | 'suspicious'
  x: number
  y: number
}

const deviceIcons = {
  laptop: Monitor,
  phone: Smartphone,
  tablet: Tablet,
  iot: Radio,
  router: Router,
}

const statusColors = {
  online: '#10b981',
  offline: '#6b7280',
  suspicious: '#ef4444',
}

export function NetworkMap({ devices = [] }: { devices?: Device[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [filteredStatus, setFilteredStatus] = useState<'all' | 'online' | 'offline' | 'suspicious'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  // Generate mock devices if none provided
  const mockDevices: Device[] = [
    { id: '1', name: 'Main Router', type: 'router', ip: '192.168.1.1', mac: '00:1A:2B:3C:4D:5E', status: 'online', x: 50, y: 50 },
    { id: '2', name: 'MacBook Pro', type: 'laptop', ip: '192.168.1.100', mac: '00:1A:2B:3C:4D:5F', status: 'online', x: 30, y: 70 },
    { id: '3', name: 'iPhone 15', type: 'phone', ip: '192.168.1.101', mac: '00:1A:2B:3C:4D:60', status: 'online', x: 70, y: 30 },
    { id: '4', name: 'iPad Air', type: 'tablet', ip: '192.168.1.102', mac: '00:1A:2B:3C:4D:61', status: 'offline', x: 70, y: 70 },
    { id: '5', name: 'Smart Thermostat', type: 'iot', ip: '192.168.1.103', mac: '00:1A:2B:3C:4D:62', status: 'online', x: 20, y: 40 },
    { id: '6', name: 'Unknown Device', type: 'iot', ip: '192.168.1.104', mac: '00:1A:2B:3C:4D:63', status: 'suspicious', x: 80, y: 50 },
  ]

  const displayDevices = devices.length > 0 ? devices : mockDevices

  const filteredDevices = displayDevices.filter((device) => {
    const matchesStatus = filteredStatus === 'all' || device.status === filteredStatus
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.ip.includes(searchQuery) ||
      device.mac.includes(searchQuery)
    return matchesStatus && matchesSearch
  })

  // Draw network map
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = 'rgb(10, 10, 10)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Apply transformations
    ctx.translate(pan.x, pan.y)
    ctx.scale(zoom, zoom)

    // Draw grid
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 100; i += 10) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 100)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(100, i)
      ctx.stroke()
    }

    // Draw connections
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)'
    ctx.lineWidth = 1
    const routerDevice = filteredDevices.find((d) => d.type === 'router')
    if (routerDevice) {
      filteredDevices.forEach((device) => {
        if (device.id !== routerDevice.id) {
          ctx.beginPath()
          ctx.moveTo(routerDevice.x, routerDevice.y)
          ctx.lineTo(device.x, device.y)
          ctx.stroke()
        }
      })
    }

    // Draw devices
    filteredDevices.forEach((device) => {
      const radius = 5
      const color = statusColors[device.status]

      // Draw device circle
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(device.x, device.y, radius, 0, Math.PI * 2)
      ctx.fill()

      // Draw glow for selected
      if (selectedDevice?.id === device.id) {
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(device.x, device.y, radius + 3, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Draw label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(device.name.substring(0, 12), device.x, device.y + 15)
    })
  }, [zoom, pan, filteredDevices, selectedDevice])

  // Handle canvas interactions
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left - pan.x) / zoom
    const y = (e.clientY - rect.top - pan.y) / zoom

    // Check if clicked on a device
    const clickedDevice = filteredDevices.find((device) => {
      const dx = device.x - x
      const dy = device.y - y
      return Math.sqrt(dx * dx + dy * dy) < 8
    })

    if (clickedDevice) {
      setSelectedDevice(clickedDevice)
    } else {
      // Start panning
      setIsDragging(true)
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      })
    }
  }

  const handleCanvasMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoom = (direction: 'in' | 'out') => {
    const newZoom = direction === 'in' ? zoom * 1.2 : zoom / 1.2
    setZoom(Math.max(0.5, Math.min(3, newZoom)))
  }

  const handleResetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setSelectedDevice(null)
  }

  const handleDownloadMap = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `network-map-${new Date().toISOString().slice(0, 10)}.png`
    link.click()

    toast.success('Map downloaded successfully')
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by device name, IP, or MAC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => { }}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Status</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
            <div className="absolute top-full right-0 mt-2 w-40 bg-card border border-border rounded-lg p-2 z-50 hidden group-hover:block">
              {['all', 'online', 'offline', 'suspicious'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilteredStatus(status as any)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${filteredStatus === status
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-secondary'
                    }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadMap}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex gap-4">
        {/* Canvas */}
        <div className="flex-1 border border-border rounded-lg overflow-hidden bg-background relative" ref={containerRef}>
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="w-full h-[500px] cursor-move"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          />

          {/* Map Controls */}
          <div className="absolute right-4 top-4 flex flex-col gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleZoom('in')}
              className="h-9 w-9 p-0"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleZoom('out')}
              className="h-9 w-9 p-0"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleResetView}
              className="h-9 w-9 p-0"
              aria-label="Reset view"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Device List */}
        <div className="w-64 border border-border rounded-lg p-4 bg-secondary/30 overflow-y-auto max-h-[500px]">
          <h3 className="font-semibold mb-4">
            Devices ({filteredDevices.length})
          </h3>

          <div className="space-y-2">
            {filteredDevices.map((device) => {
              const Icon = deviceIcons[device.type]
              return (
                <button
                  key={device.id}
                  onClick={() => setSelectedDevice(device)}
                  className={`w-full text-left px-3 py-2 rounded-lg border transition-all hover:translate-x-1 ${selectedDevice?.id === device.id
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50'
                    }`}
                >
                  <div className="flex items-start gap-2">
                    <Icon className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{device.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {device.ip}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: statusColors[device.status] }}
                        />
                        <span className="text-xs text-muted-foreground capitalize">
                          {device.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Selected Device Details */}
      {selectedDevice && (
        <div
          className="border border-border rounded-lg p-4 bg-secondary/50 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-semibold">{selectedDevice.name}</h4>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div>
                  <span className="text-foreground font-medium">IP Address:</span> {selectedDevice.ip}
                </div>
                <div>
                  <span className="text-foreground font-medium">MAC Address:</span> {selectedDevice.mac}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">Status:</span>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: statusColors[selectedDevice.status] }}
                  />
                  <span className="capitalize">{selectedDevice.status}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDevice(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
