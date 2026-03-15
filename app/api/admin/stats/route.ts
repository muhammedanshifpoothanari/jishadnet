import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const db = await getDb()
    const companyId = session.companyId

    const [total, active, pending, flagged, byType, recentDevices] = await Promise.all([
      db.collection("devices").countDocuments({ companyId }),
      db.collection("devices").countDocuments({ companyId, status: "active" }),
      db.collection("devices").countDocuments({ companyId, status: "pending" }),
      db.collection("devices").countDocuments({ companyId, status: "flagged" }),
      db.collection("devices").aggregate([
        { $match: { companyId } },
        { $group: { _id: "$deviceType", count: { $sum: 1 } } },
      ]).toArray(),
      db.collection("devices")
        .find({ companyId })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
    ])

    return NextResponse.json({
      total,
      active,
      pending,
      flagged,
      byType: byType.map((d) => ({ type: d._id, count: d.count })),
      recentDevices: recentDevices.map((d) => ({
        id: d._id.toString(),
        user: d.user,
        deviceType: d.deviceType,
        status: d.status,
        mac: d.mac,
        createdAt: d.createdAt,
      })),
    })
  } catch (error) {
    console.error("[API] Stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
