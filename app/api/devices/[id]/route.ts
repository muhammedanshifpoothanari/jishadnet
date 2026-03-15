import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

async function getDevice(id: string, companyId: string) {
  const db = await getDb()
  try {
    return await db.collection("devices").findOne({ _id: new ObjectId(id), companyId })
  } catch {
    return null
  }
}

// GET - single device
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const device = await getDevice(id, session.companyId)
  if (!device) return NextResponse.json({ error: "Device not found" }, { status: 404 })

  return NextResponse.json({ ...device, id: device._id.toString(), _id: undefined })
}

// PATCH - update device
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const db = await getDb()

    const allowed = ["user", "phone", "deviceType", "mac", "ip1", "ip2", "ssid", "status"]
    const update: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) update[key] = body[key]
    }
    update.updatedAt = new Date()

    const result = await db.collection("devices").updateOne(
      { _id: new ObjectId(id), companyId: session.companyId },
      { $set: update }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Device PATCH error:", error)
    return NextResponse.json({ error: "Failed to update device" }, { status: 500 })
  }
}

// DELETE - remove device
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const db = await getDb()
    const result = await db.collection("devices").deleteOne({
      _id: new ObjectId(id),
      companyId: session.companyId,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Device DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete device" }, { status: 500 })
  }
}
