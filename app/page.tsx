"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Shield,
  Wifi,
  MonitorSmartphone,
  Lock,
  ChevronRight,
  ArrowRight,
  Network,
  Eye,
  Fingerprint,
  Zap,
  Globe,
  Server,
  Menu,
  X,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)

  async function handleDownloadCode() {
    setDownloading(true)
    try {
      const res = await fetch("/api/download-code")
      if (!res.ok) throw new Error("Download failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "jishadnet-project.zip"
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("[v0] Download error:", err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border safe-area-inset-top">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                <Network className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-semibold tracking-tight">JishadNet</span>
            </div>

            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Product
              </Link>
              <Link href="#security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Security
              </Link>
              <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Register Device
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Admin Login
                </Button>
              </Link>
              <Link href="/register/company">
                <Button size="sm" className="gap-2">
                  Register Company <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                className="p-2 -mr-2 touch-manipulation"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu - Full screen overlay */}
        <div
          className={`md:hidden fixed inset-0 top-14 bg-background z-40 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          <div
            className={`flex flex-col h-full transition-transform duration-300 ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-4'}`}
          >
            <div className="flex-1 px-6 py-8 space-y-2 overflow-y-auto">
              {[
                { href: "#features", label: "Features" },
                { href: "#demo", label: "Product" },
                { href: "#security", label: "Security" },
                { href: "/register", label: "Register Device" },
              ].map((item, index) => (
                <div
                  key={item.href}
                  className="animate-in fade-in slide-in-from-left-4 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-4 text-lg font-medium text-foreground border-b border-border touch-manipulation"
                  >
                    {item.label}
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </div>
              ))}
            </div>
            <div className="p-6 space-y-3 border-t border-border bg-secondary/30 safe-area-inset-bottom">
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button variant="outline" size="lg" className="w-full h-12 text-base">
                  Admin Login
                </Button>
              </Link>
              <Link href="/register/company" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button size="lg" className="w-full h-12 text-base gap-2">
                  Register Company <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-accent/10 rounded-full blur-3xl opacity-50" />

        {/* Animated Network Visualization */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 sm:opacity-40" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgb(var(--color-accent))', stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: 'rgb(var(--color-accent))', stopOpacity: 0.2 }} />
            </linearGradient>
          </defs>

          {/* Network connections lines */}
          <g strokeLinecap="round" stroke="url(#networkGradient)" strokeWidth="1.5" opacity="0.6">
            <line x1="200" y1="150" x2="500" y2="300" className="animate-network-path" />
            <line x1="500" y1="300" x2="800" y2="150" className="animate-network-path" style={{ animationDelay: '0.5s' }} />
            <line x1="800" y1="150" x2="700" y2="450" className="animate-network-path" style={{ animationDelay: '1s' }} />
            <line x1="700" y1="450" x2="300" y2="450" className="animate-network-path" style={{ animationDelay: '1.5s' }} />
            <line x1="300" y1="450" x2="200" y2="150" className="animate-network-path" style={{ animationDelay: '2s' }} />
          </g>

          {/* Network nodes */}
          <g fill="currentColor" className="text-accent">
            <circle cx="200" cy="150" r="8" className="animate-pulse-node" filter="url(#glow)" />
            <circle cx="500" cy="300" r="10" className="animate-pulse-node-large" filter="url(#glow)" />
            <circle cx="800" cy="150" r="8" className="animate-pulse-node-delayed-1" filter="url(#glow)" />
            <circle cx="700" cy="450" r="8" className="animate-pulse-node-delayed-2" filter="url(#glow)" />
            <circle cx="300" cy="450" r="8" className="animate-pulse-node-delayed-3" filter="url(#glow)" />
          </g>

          {/* Floating data packets */}
          <g className="text-accent/50">
            <circle cx="200" cy="150" r="3" className="animate-packet-1" />
            <circle cx="800" cy="150" r="3" className="animate-packet-2" />
            <circle cx="300" cy="450" r="3" className="animate-packet-3" />
          </g>
        </svg>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center">
            <div className="mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm text-muted-foreground backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Enterprise Network Security
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-balance px-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200"
            >
              Secure Your Network.
              <br />
              <span className="text-accent">Know Every Device.</span>
            </h1>

            <p
              className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance px-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300"
            >
              The enterprise-grade WiFi device registration and IP tracking platform
              trusted by leading organizations across Saudi Arabia.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400">
              <Link href="/register/company" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 px-6 sm:px-8 h-12 sm:h-11 text-base">
                  Register Your Company <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#demo" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 px-6 sm:px-8 h-12 sm:h-11 text-base">
                  View Demo
                </Button>
              </Link>
            </div>

            <div
              className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500"
            >
              {[
                { value: "10K+", label: "Devices Managed" },
                { value: "99.9%", label: "Uptime" },
                { value: "50+", label: "Enterprise Clients" },
                { value: "24/7", label: "Support" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 sm:py-20 lg:py-32 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="text-center mb-10 sm:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Enterprise-Grade Features
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Built for organizations that demand complete visibility and control over their network infrastructure.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: MonitorSmartphone,
                title: "Device Registration",
                description: "Streamlined process for registering laptops, phones, tablets, and IoT devices with automatic MAC address validation."
              },
              {
                icon: Eye,
                title: "Real-time Monitoring",
                description: "Track device connections, IP assignments, and network activity with live dashboards and instant alerts."
              },
              {
                icon: Fingerprint,
                title: "Identity Verification",
                description: "Link every device to verified user identities with multi-factor authentication and department tracking."
              },
              {
                icon: Shield,
                title: "Threat Detection",
                description: "Identify suspicious devices, duplicate IPs, and unauthorized network access attempts automatically."
              },
              {
                icon: Globe,
                title: "Multi-Site Support",
                description: "Manage devices across multiple locations with centralized control and site-specific policies."
              },
              {
                icon: Zap,
                title: "Instant Provisioning",
                description: "Approve or block devices in seconds with automated SSID assignment and IP allocation."
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-border bg-card p-5 sm:p-6 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 active:scale-[0.98] touch-manipulation animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section id="demo" className="py-16 sm:py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div
              className="order-2 lg:order-1 animate-in fade-in slide-in-from-left-4 duration-700"
            >
              <span className="text-sm font-medium text-accent">Product Overview</span>
              <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Complete Network Visibility at Your Fingertips
              </h2>
              <p className="mt-3 sm:mt-4 text-muted-foreground leading-relaxed">
                Our intuitive dashboard gives you real-time insights into every device on your network.
                From registration to monitoring, manage your entire infrastructure from a single pane of glass.
              </p>

              <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                {[
                  "Unified device inventory with detailed profiles",
                  "Real-time connection status and IP tracking",
                  "Automated security alerts and compliance reports",
                  "Bulk operations for efficient device management"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                    </div>
                    <span className="text-sm sm:text-base text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 sm:mt-8">
                <Link href="/admin">
                  <Button className="gap-2 h-11 sm:h-10 px-5 sm:px-4 text-base sm:text-sm w-full sm:w-auto">
                    Explore Dashboard <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="relative order-1 lg:order-2 animate-in fade-in slide-in-from-right-4 duration-700"
            >
              <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border bg-secondary/50">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-destructive/70" />
                    <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-chart-3/70" />
                    <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-accent/70" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">Admin Dashboard</span>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {[
                      { label: "Total Devices", value: "2,847", change: "+12%" },
                      { label: "Active Users", value: "1,423", change: "+8%" },
                      { label: "Unique SSIDs", value: "24", change: "+2" },
                      { label: "Alerts", value: "7", change: "-3" }
                    ].map((card) => (
                      <div key={card.label} className="rounded-xl bg-secondary/50 p-3 sm:p-4">
                        <div className="text-[10px] sm:text-xs text-muted-foreground">{card.label}</div>
                        <div className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1">{card.value}</div>
                        <div className="text-[10px] sm:text-xs text-accent mt-0.5 sm:mt-1">{card.change}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl bg-secondary/50 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Device Types</div>
                    <div className="space-y-2">
                      {[
                        { type: "Laptops", value: 45, color: "bg-accent" },
                        { type: "Phones", value: 35, color: "bg-chart-2" },
                        { type: "Tablets", value: 15, color: "bg-chart-3" },
                        { type: "IoT", value: 5, color: "bg-chart-4" }
                      ].map((item) => (
                        <div key={item.type} className="flex items-center gap-2 sm:gap-3">
                          <span className="text-[10px] sm:text-xs text-muted-foreground w-12 sm:w-16">{item.type}</span>
                          <div className="flex-1 h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                          </div>
                          <span className="text-[10px] sm:text-xs text-muted-foreground w-6 sm:w-8">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-3 sm:-bottom-4 -right-3 sm:-right-4 -z-10 h-full w-full rounded-2xl bg-accent/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-16 sm:py-20 lg:py-32 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="text-center mb-10 sm:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <span className="text-sm font-medium text-accent">Security First</span>
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Enterprise Security You Can Trust
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Built with security at its core, JishadNet helps you maintain compliance
              and protect your network infrastructure.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: Lock,
                title: "End-to-End Encryption",
                description: "All data is encrypted in transit and at rest using AES-256 encryption standards."
              },
              {
                icon: Shield,
                title: "Compliance Ready",
                description: "Meet regulatory requirements with comprehensive audit logs and compliance reporting."
              },
              {
                icon: Server,
                title: "On-Premise Option",
                description: "Deploy on your own infrastructure for complete data sovereignty and control."
              },
              {
                icon: Wifi,
                title: "Network Isolation",
                description: "Automatically quarantine suspicious devices and prevent unauthorized access."
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="flex gap-3 sm:gap-4 rounded-2xl border border-border bg-card p-4 sm:p-6 active:scale-[0.99] touch-manipulation animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border border-accent/20 p-6 sm:p-8 md:p-16 text-center overflow-hidden animate-in fade-in zoom-in-95 duration-700"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,200,180,0.1),transparent_50%)]" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 px-2">
                Ready to Secure Your Network?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-6 sm:mb-8 px-2">
                Join leading organizations in Saudi Arabia who trust JishadNet
                for their network security needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2 h-12 sm:h-11 px-6 sm:px-8 text-base">
                    Start Free Trial <ChevronRight className="h-5 w-5" />
                  </Button>
                </Link>
                <a
                  href="https://wa.me/00966550543956?text=Hi%2C%20I%20am%20interested%20in%20JishadNet%20for%20my%20organization."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 sm:h-11 px-6 sm:px-8 text-base">
                    Contact Sales
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 sm:py-12 safe-area-inset-bottom">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-accent flex items-center justify-center">
                <Network className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground" />
              </div>
              <span className="text-base sm:text-lg font-semibold tracking-tight">JishadNet</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              2026 JishadNet. All rights reserved.
            </p>

          </div>
        </div>
      </footer>
    </div>
  )
}
