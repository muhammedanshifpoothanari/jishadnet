import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDb } from "@/lib/mongodb"
import { setSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export async function POST(req: NextRequest) {
  try {
    const { email, password, companyId } = await req.json()

    if (!email || !password || !companyId) {
      return NextResponse.json({ error: "Missing email, password, or company" }, { status: 400 })
    }

    const db = await getDb()

    // Find user by email and companyId
    const user = await db.collection("users").findOne({
      email: email.toLowerCase().trim(),
      companyId,
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Fetch company name
    let companyName = ""
    try {
      const company = await db.collection("companies").findOne({ _id: new ObjectId(companyId) })
      companyName = company?.companyName ?? ""
    } catch {}

    // Set session cookie
    await setSession({
      userId: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      companyId,
      companyName,
      role: user.role,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        companyId,
        companyName,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("[API] Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
