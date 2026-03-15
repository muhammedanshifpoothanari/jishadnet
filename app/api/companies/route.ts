import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

// GET - list all companies (for login dropdown)
export async function GET() {
  try {
    const db = await getDb()
    const companies = await db
      .collection("companies")
      .find({}, { projection: { companyName: 1 } })
      .sort({ companyName: 1 })
      .toArray()

    return NextResponse.json(
      companies.map((c) => ({
        id: c._id.toString(),
        companyName: c.companyName,
      }))
    )
  } catch (error) {
    console.error("[API] Companies GET error:", error)
    return NextResponse.json([], { status: 500 })
  }
}
