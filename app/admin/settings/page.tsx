"use client"

import { useState } from "react"
import {
  Wifi,
  Clock,
  Users,
  Plus,
  Trash2,
  Save,
  Mail,
  Shield,
  Settings,
  X,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface SSID {
  id: string
  name: string
  type: "corporate" | "guest" | "iot" | "restricted"
  autoApprove: boolean
  maxDevices: number
}

interface Admin {
  id: string
  name: string
  email: string
  role: "super" | "admin" | "viewer"
  status: "active" | "pending"
}

const initialSSIDs: SSID[] = [
  { id: "1", name: "CORP-MAIN", type: "corporate", autoApprove: false, maxDevices: 1000 },
  { id: "2", name: "CORP-GUEST", type: "guest", autoApprove: true, maxDevices: 500 },
  { id: "3", name: "CORP-SECURE", type: "corporate", autoApprove: false, maxDevices: 200 },
  { id: "4", name: "IOT-NETWORK", type: "iot", autoApprove: true, maxDevices: 300 },
  { id: "5", name: "RESTRICTED", type: "restricted", autoApprove: false, maxDevices: 50 },
]

const initialAdmins: Admin[] = [
  { id: "1", name: "Admin User", email: "admin@rishadnet.com", role: "super", status: "active" },
  { id: "2", name: "Mohammed Faisal", email: "m.faisal@company.sa", role: "admin", status: "active" },
  { id: "3", name: "Sarah Khan", email: "s.khan@company.sa", role: "viewer", status: "active" },
]

const ssidTypeStyles: Record<string, string> = {
  corporate: "bg-accent/10 text-accent",
  guest: "bg-chart-3/10 text-chart-3",
  iot: "bg-chart-2/10 text-chart-2",
  restricted: "bg-destructive/10 text-destructive",
}

const roleStyles: Record<string, string> = {
  super: "bg-destructive/10 text-destructive",
  admin: "bg-accent/10 text-accent",
  viewer: "bg-muted text-muted-foreground",
}

export default function SettingsPage() {
  const [ssids, setSSIDs] = useState<SSID[]>(initialSSIDs)
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins)
  const [expirationDays, setExpirationDays] = useState("90")
  const [autoBlock, setAutoBlock] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [newSSID, setNewSSID] = useState({ name: "", type: "corporate" as SSID["type"], maxDevices: "100" })
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<Admin["role"]>("viewer")
  const [ssidSheetOpen, setSSIDSheetOpen] = useState(false)
  const [inviteSheetOpen, setInviteSheetOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleAddSSID = () => {
    if (newSSID.name) {
      setSSIDs([...ssids, {
        id: Date.now().toString(),
        name: newSSID.name.toUpperCase().replace(/\s+/g, "-"),
        type: newSSID.type,
        autoApprove: newSSID.type === "guest" || newSSID.type === "iot",
        maxDevices: parseInt(newSSID.maxDevices) || 100
      }])
      setNewSSID({ name: "", type: "corporate", maxDevices: "100" })
      setSSIDSheetOpen(false)
    }
  }

  const handleRemoveSSID = (id: string) => {
    setSSIDs(ssids.filter(s => s.id !== id))
  }

  const handleInviteAdmin = () => {
    if (inviteEmail) {
      setAdmins([...admins, {
        id: Date.now().toString(),
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
        status: "pending"
      }])
      setInviteEmail("")
      setInviteRole("viewer")
      setInviteSheetOpen(false)
    }
  }

  const handleRemoveAdmin = (id: string) => {
    setAdmins(admins.filter(a => a.id !== id))
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage system configuration and access control</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2 h-10 sm:h-9 self-start sm:self-auto">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* SSID Management */}
      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <Card>
          <CardHeader className="flex flex-row items-start sm:items-center justify-between gap-3 pb-3 sm:pb-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Wifi className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                Manage SSIDs
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Configure available network SSIDs</CardDescription>
            </div>
            <Sheet open={ssidSheetOpen} onOpenChange={setSSIDSheetOpen}>
              <SheetTrigger asChild>
                <Button size="sm" className="gap-2 h-9 flex-shrink-0">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add SSID</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl sm:h-full sm:max-w-md">
                <SheetHeader className="text-left pb-4">
                  <SheetTitle>Add New SSID</SheetTitle>
                  <SheetDescription>
                    Configure a new network SSID for device registration
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor="ssidName" className="text-sm">SSID Name</Label>
                    <Input
                      id="ssidName"
                      placeholder="e.g., CORP-NEW"
                      value={newSSID.name}
                      onChange={(e) => setNewSSID({ ...newSSID, name: e.target.value })}
                      className="h-12 sm:h-10 text-base sm:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ssidType" className="text-sm">Network Type</Label>
                    <Select
                      value={newSSID.type}
                      onValueChange={(v: SSID["type"]) => setNewSSID({ ...newSSID, type: v })}
                    >
                      <SelectTrigger className="h-12 sm:h-10 text-base sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporate" className="py-3 sm:py-2">Corporate</SelectItem>
                        <SelectItem value="guest" className="py-3 sm:py-2">Guest</SelectItem>
                        <SelectItem value="iot" className="py-3 sm:py-2">IoT</SelectItem>
                        <SelectItem value="restricted" className="py-3 sm:py-2">Restricted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxDevices" className="text-sm">Max Devices</Label>
                    <Input
                      id="maxDevices"
                      type="number"
                      placeholder="100"
                      value={newSSID.maxDevices}
                      onChange={(e) => setNewSSID({ ...newSSID, maxDevices: e.target.value })}
                      className="h-12 sm:h-10 text-base sm:text-sm"
                    />
                  </div>
                </div>
                <SheetFooter className="flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setSSIDSheetOpen(false)} className="h-12 sm:h-10 w-full sm:w-auto">Cancel</Button>
                  <Button onClick={handleAddSSID} className="h-12 sm:h-10 w-full sm:w-auto">Add SSID</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </CardHeader>
          <CardContent>
            {/* Mobile: Card list */}
            <div className="sm:hidden space-y-3">
              {ssids.map((ssid) => (
                <div key={ssid.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-medium truncate">{ssid.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`${ssidTypeStyles[ssid.type]} border-0 capitalize text-[10px]`}>
                          {ssid.type}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{ssid.maxDevices} max</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={ssid.autoApprove}
                      onCheckedChange={(checked) => {
                        setSSIDs(ssids.map(s => s.id === ssid.id ? { ...s, autoApprove: checked } : s))
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveSSID(ssid.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table */}
            <div className="hidden sm:block rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left text-sm font-medium px-4 py-3">SSID Name</th>
                    <th className="text-left text-sm font-medium px-4 py-3">Type</th>
                    <th className="text-left text-sm font-medium px-4 py-3">Auto Approve</th>
                    <th className="text-left text-sm font-medium px-4 py-3 hidden md:table-cell">Max Devices</th>
                    <th className="w-[50px] px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {ssids.map((ssid) => (
                    <tr key={ssid.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium font-mono text-sm">{ssid.name}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`${ssidTypeStyles[ssid.type]} border-0 capitalize`}>
                          {ssid.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Switch
                          checked={ssid.autoApprove}
                          onCheckedChange={(checked) => {
                            setSSIDs(ssids.map(s => s.id === ssid.id ? { ...s, autoApprove: checked } : s))
                          }}
                        />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-sm text-muted-foreground">{ssid.maxDevices}</td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveSSID(ssid.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Expiration */}
      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-both"
      >
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              Device Expiration
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Configure automatic device expiration settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="space-y-1">
                <Label className="text-sm">Expiration Period</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Devices will require re-registration after this period
                </p>
              </div>
              <Select value={expirationDays} onValueChange={setExpirationDays}>
                <SelectTrigger className="w-full sm:w-[180px] h-11 sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30" className="py-3 sm:py-2">30 days</SelectItem>
                  <SelectItem value="60" className="py-3 sm:py-2">60 days</SelectItem>
                  <SelectItem value="90" className="py-3 sm:py-2">90 days</SelectItem>
                  <SelectItem value="180" className="py-3 sm:py-2">180 days</SelectItem>
                  <SelectItem value="365" className="py-3 sm:py-2">1 year</SelectItem>
                  <SelectItem value="never" className="py-3 sm:py-2">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-border">
              <div className="space-y-1">
                <Label className="text-sm">Auto-block Expired Devices</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Automatically block network access for expired devices
                </p>
              </div>
              <Switch checked={autoBlock} onCheckedChange={setAutoBlock} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-both"
      >
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              Notifications
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Configure alert and notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <Label className="text-sm">Email Notifications</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Receive email alerts for security events
                </p>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Management */}
      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-both"
      >
        <Card>
          <CardHeader className="flex flex-row items-start sm:items-center justify-between gap-3 pb-3 sm:pb-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                Admin Users
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Manage administrator access</CardDescription>
            </div>
            <Sheet open={inviteSheetOpen} onOpenChange={setInviteSheetOpen}>
              <SheetTrigger asChild>
                <Button size="sm" className="gap-2 h-9 flex-shrink-0">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Invite Admin</span>
                  <span className="sm:hidden">Invite</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl sm:h-full sm:max-w-md">
                <SheetHeader className="text-left pb-4">
                  <SheetTitle>Invite Administrator</SheetTitle>
                  <SheetDescription>
                    Send an invitation to a new admin user
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor="inviteEmail" className="text-sm">Email Address</Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      placeholder="admin@company.sa"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="h-12 sm:h-10 text-base sm:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inviteRole" className="text-sm">Role</Label>
                    <Select
                      value={inviteRole}
                      onValueChange={(v: Admin["role"]) => setInviteRole(v)}
                    >
                      <SelectTrigger className="h-12 sm:h-10 text-base sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super" className="py-3 sm:py-2">Super Admin</SelectItem>
                        <SelectItem value="admin" className="py-3 sm:py-2">Admin</SelectItem>
                        <SelectItem value="viewer" className="py-3 sm:py-2">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {inviteRole === "super" && "Full access to all settings and user management"}
                      {inviteRole === "admin" && "Can manage devices and respond to alerts"}
                      {inviteRole === "viewer" && "Read-only access to dashboard and reports"}
                    </p>
                  </div>
                </div>
                <SheetFooter className="flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setInviteSheetOpen(false)} className="h-12 sm:h-10 w-full sm:w-auto">Cancel</Button>
                  <Button onClick={handleInviteAdmin} className="h-12 sm:h-10 w-full sm:w-auto">Send Invitation</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </CardHeader>
          <CardContent>
            {/* Mobile: Card list */}
            <div className="sm:hidden space-y-3">
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{admin.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className={`${roleStyles[admin.role]} border-0 capitalize text-[10px]`}>
                        {admin.role === "super" ? "Super Admin" : admin.role}
                      </Badge>
                      <Badge variant="outline" className={`${admin.status === "active" ? "bg-accent/10 text-accent" : "bg-chart-3/10 text-chart-3"} border-0 text-[10px]`}>
                        {admin.status}
                      </Badge>
                    </div>
                  </div>
                  {admin.role !== "super" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                      onClick={() => handleRemoveAdmin(admin.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop: Table */}
            <div className="hidden sm:block rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left text-sm font-medium px-4 py-3">Name</th>
                    <th className="text-left text-sm font-medium px-4 py-3 hidden md:table-cell">Email</th>
                    <th className="text-left text-sm font-medium px-4 py-3">Role</th>
                    <th className="text-left text-sm font-medium px-4 py-3">Status</th>
                    <th className="w-[50px] px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-sm">{admin.name}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{admin.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-sm hidden md:table-cell">
                        {admin.email}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`${roleStyles[admin.role]} border-0 capitalize`}>
                          {admin.role === "super" ? "Super Admin" : admin.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={admin.status === "active" ? "bg-accent/10 text-accent border-0" : "bg-chart-3/10 text-chart-3 border-0"}>
                          {admin.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {admin.role !== "super" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveAdmin(admin.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[250ms] fill-both"
      >
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">Version</p>
                <p className="text-sm font-medium">RishadNet v1.0.0</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">Last Backup</p>
                <p className="text-sm font-medium">Dec 15, 2025</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">Total Devices</p>
                <p className="text-sm font-medium">2,847</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">API Status</p>
                <p className="text-sm font-medium text-accent">Operational</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
