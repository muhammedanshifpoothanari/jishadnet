"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet,
  Router,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Ban,
  X,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface Device {
  id: string
  user: string
  phone: string
  deviceType: string
  mac: string
  ip1: string
  ip2: string
  ssid: string
  status: string
  createdAt: string
}

const deviceTypeIcons: Record<string, typeof Monitor> = {
  laptop: Monitor,
  phone: Smartphone,
  tablet: Tablet,
  iot: Router,
}

const statusColors: Record<string, string> = {
  active: "bg-accent/10 text-accent border-accent/20",
  pending: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  flagged: "bg-destructive/10 text-destructive border-destructive/20",
  blocked: "bg-secondary text-muted-foreground border-border",
}

const defaultForm = {
  user: "",
  phone: "",
  deviceType: "laptop",
  mac: "",
  ip1: "",
  ip2: "",
  ssid: "",
}

interface FormFieldsProps {
  form: typeof defaultForm
  setForm: React.Dispatch<React.SetStateAction<typeof defaultForm>>
}

const FormFields = ({ form, setForm }: FormFieldsProps) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2 space-y-2">
        <Label htmlFor="user">User / Owner Name *</Label>
        <Input
          id="user"
          placeholder="Full name"
          value={form.user}
          onChange={(e) => setForm((p) => ({ ...p, user: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          placeholder="+966 5XX XXX XXXX"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="deviceType">Device Type *</Label>
        <Select value={form.deviceType} onValueChange={(v) => setForm((p) => ({ ...p, deviceType: v }))}>
          <SelectTrigger id="deviceType"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="laptop">Laptop</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="tablet">Tablet</SelectItem>
            <SelectItem value="iot">IoT Device</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-2 space-y-2">
        <Label htmlFor="mac">MAC Address *</Label>
        <Input
          id="mac"
          placeholder="AA:BB:CC:DD:EE:FF"
          value={form.mac}
          onChange={(e) => setForm((p) => ({ ...p, mac: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ip1">IP Address 1</Label>
        <Input
          id="ip1"
          placeholder="192.168.1.100"
          value={form.ip1}
          onChange={(e) => setForm((p) => ({ ...p, ip1: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ip2">IP Address 2</Label>
        <Input
          id="ip2"
          placeholder="10.0.0.100"
          value={form.ip2}
          onChange={(e) => setForm((p) => ({ ...p, ip2: e.target.value }))}
        />
      </div>
      <div className="col-span-2 space-y-2">
        <Label htmlFor="ssid">SSID / Network</Label>
        <Input
          id="ssid"
          placeholder="CORP-MAIN"
          value={form.ssid}
          onChange={(e) => setForm((p) => ({ ...p, ssid: e.target.value }))}
        />
      </div>
    </div>
  </div>
)

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [page, setPage] = useState(1)

  // Dialogs
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)

  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const fetchDevices = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(typeFilter !== "all" && { type: typeFilter }),
      })
      const res = await fetch(`/api/devices?${params}`)
      const data = await res.json()
      if (res.ok) {
        setDevices(data.devices)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      }
    } catch {
      toast.error("Failed to load devices")
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, typeFilter])

  useEffect(() => {
    fetchDevices()
  }, [fetchDevices])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setPage(1), 400)
    return () => clearTimeout(t)
  }, [search])

  const handleAdd = async () => {
    if (!form.user || !form.deviceType || !form.mac) {
      toast.error("User, device type and MAC address are required")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "Failed to add device"); return }
      toast.success("Device added successfully")
      setAddOpen(false)
      setForm(defaultForm)
      fetchDevices()
    } catch {
      toast.error("Failed to add device")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedDevice) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/devices/${selectedDevice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "Failed to update device"); return }
      toast.success("Device updated")
      setEditOpen(false)
      fetchDevices()
    } catch {
      toast.error("Failed to update device")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedDevice) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/devices/${selectedDevice.id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "Failed to delete device"); return }
      toast.success("Device deleted")
      setDeleteOpen(false)
      fetchDevices()
    } catch {
      toast.error("Failed to delete device")
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (device: Device, status: string) => {
    try {
      const res = await fetch(`/api/devices/${device.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      toast.success(`Device ${status}`)
      fetchDevices()
    } catch {
      toast.error("Failed to update status")
    }
  }

  const openEdit = (device: Device) => {
    setSelectedDevice(device)
    setForm({
      user: device.user,
      phone: device.phone,
      deviceType: device.deviceType,
      mac: device.mac,
      ip1: device.ip1,
      ip2: device.ip2,
      ssid: device.ssid,
    })
    setEditOpen(true)
  }

  const openDelete = (device: Device) => {
    setSelectedDevice(device)
    setDeleteOpen(true)
  }

  return (
    <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 lg:pt-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Devices</h1>
          <p className="text-sm text-muted-foreground">{total} total device{total !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => { setForm(defaultForm); setAddOpen(true) }} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Device</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user, MAC, IP, SSID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
            <SelectTrigger className="w-[130px] h-10">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1) }}>
            <SelectTrigger className="w-[130px] h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="laptop">Laptop</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
              <SelectItem value="iot">IoT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading devices...</span>
          </div>
        ) : devices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <AlertCircle className="h-8 w-8" />
            <p className="text-sm font-medium">No devices found</p>
            <p className="text-xs">
              {search || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your filters"
                : "Add your first device to get started"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="w-10"></TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>MAC Address</TableHead>
                    <TableHead>IP (Primary)</TableHead>
                    <TableHead>SSID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => {
                    const Icon = deviceTypeIcons[device.deviceType] ?? Monitor
                    return (
                      <TableRow key={device.id} className="hover:bg-secondary/30 transition-colors">
                        <TableCell>
                          <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{device.user}</p>
                            <p className="text-xs text-muted-foreground capitalize">{device.deviceType}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{device.mac}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{device.ip1 || "-"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{device.ssid || "-"}</TableCell>
                        <TableCell>
                          <span className={cn("text-xs px-2 py-1 rounded-full border font-medium capitalize", statusColors[device.status] || statusColors.blocked)}>
                            {device.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEdit(device)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              {device.status !== "active" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(device, "active")}>
                                  <CheckCircle className="h-4 w-4 mr-2" /> Approve
                                </DropdownMenuItem>
                              )}
                              {device.status !== "blocked" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(device, "blocked")}>
                                  <Ban className="h-4 w-4 mr-2" /> Block
                                </DropdownMenuItem>
                              )}
                              {device.status !== "flagged" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(device, "flagged")}>
                                  <AlertCircle className="h-4 w-4 mr-2" /> Flag
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => openDelete(device)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-border">
              {devices.map((device) => {
                const Icon = deviceTypeIcons[device.deviceType] ?? Monitor
                return (
                  <div key={device.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{device.user}</p>
                          <p className="text-xs text-muted-foreground capitalize">{device.deviceType}</p>
                        </div>
                      </div>
                      <span className={cn("text-xs px-2 py-1 rounded-full border font-medium capitalize", statusColors[device.status] || statusColors.blocked)}>
                        {device.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div><span className="font-medium text-foreground">MAC:</span> {device.mac}</div>
                      <div><span className="font-medium text-foreground">IP:</span> {device.ip1 || "-"}</div>
                      <div><span className="font-medium text-foreground">SSID:</span> {device.ssid || "-"}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 h-8 gap-1.5 text-xs" onClick={() => openEdit(device)}>
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </Button>
                      {device.status !== "active" && (
                        <Button size="sm" variant="outline" className="flex-1 h-8 gap-1.5 text-xs" onClick={() => handleStatusChange(device, "active")}>
                          <CheckCircle className="h-3.5 w-3.5" /> Approve
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => openDelete(device)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} &bull; {total} total
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Add Device Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Device</DialogTitle>
            <DialogDescription>Register a new device on your network.</DialogDescription>
          </DialogHeader>
          <FormFields form={form} setForm={setForm} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAdd} disabled={submitting} className="gap-2">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Device Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
            <DialogDescription>Update device information.</DialogDescription>
          </DialogHeader>
          <FormFields form={form} setForm={setForm} />
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={selectedDevice?.status} onValueChange={(v) => setSelectedDevice((p) => p ? { ...p, status: v } : p)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEdit} disabled={submitting} className="gap-2">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Device</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the device for <strong>{selectedDevice?.user}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={submitting} className="gap-2">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
