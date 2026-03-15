import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"

// GET - list devices for the current company
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const db = await getDb()
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const type = searchParams.get("type") || ""
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "10", 10)

    const query: Record<string, unknown> = { companyId: session.companyId }
    if (status && status !== "all") query.status = status
    if (type && type !== "all") query.deviceType = type
    if (search) {
      query.$or = [
        { user: { $regex: search, $options: "i" } },
        { mac: { $regex: search, $options: "i" } },
        { ip1: { $regex: search, $options: "i" } },
        { ssid: { $regex: search, $options: "i" } },
      ]
    }

    const total = await db.collection("devices").countDocuments(query)
    const devices = await db
      .collection("devices")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      devices: devices.map((d) => ({ ...d, id: d._id.toString(), _id: undefined })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("[API] Devices GET error:", error)
    return NextResponse.json({ error: "Failed to fetch devices" }, { status: 500 })
  }
}

// POST - create a new device
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { user, phone, deviceType, mac, ip1, ip2, ssid } = body

    if (!user || !deviceType || !mac) {
      return NextResponse.json({ error: "User, device type and MAC address are required" }, { status: 400 })
    }

    const db = await getDb()

    // Check MAC uniqueness within company
    const existing = await db.collection("devices").findOne({ mac, companyId: session.companyId })
    if (existing) {
      return NextResponse.json({ error: "A device with this MAC address already exists" }, { status: 409 })
    }

    const result = await db.collection("devices").insertOne({
      user,
      phone: phone || "",
      deviceType,
      mac,
      ip1: ip1 || "",
      ip2: ip2 || "",
      ssid: ssid || "",
      status: "pending",
      companyId: session.companyId,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 })
  } catch (error) {
    console.error("[API] Devices POST error:", error)
    return NextResponse.json({ error: "Failed to create device" }, { status: 500 })
  }
}
