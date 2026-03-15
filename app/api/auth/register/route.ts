import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDb } from "@/lib/mongodb"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { companyName, industry, companyEmail, website, phone, fullName, adminEmail, password } = body

    if (!companyName || !companyEmail || !phone || !fullName || !adminEmail || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const db = await getDb()

    // Check if admin email already exists
    const existingUser = await db.collection("users").findOne({ email: adminEmail })
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    // Check if company email already exists
    const existingCompany = await db.collection("companies").findOne({ companyEmail })
    if (existingCompany) {
      return NextResponse.json({ error: "A company with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create company
    const companyResult = await db.collection("companies").insertOne({
      companyName,
      industry: industry || "",
      companyEmail,
      website: website || "",
      phone,
      createdAt: new Date(),
    })

    // Create admin user
    await db.collection("users").insertOne({
      fullName,
      email: adminEmail,
      password: hashedPassword,
      companyId: companyResult.insertedId.toString(),
      role: "admin",
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, message: "Company registered successfully" }, { status: 201 })
  } catch (error) {
    console.error("[API] Register error:", error)
    return NextResponse.json({ error: "Failed to register company" }, { status: 500 })
  }
}
