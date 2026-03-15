import { cookies } from "next/headers"

export interface SessionData {
  userId: string
  email: string
  fullName: string
  companyId: string
  companyName: string
  role: string
}

const SESSION_COOKIE = "jishadnet_session"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    const raw = cookieStore.get(SESSION_COOKIE)?.value
    if (!raw) return null
    return JSON.parse(Buffer.from(raw, "base64").toString("utf-8")) as SessionData
  } catch {
    return null
  }
}

export async function setSession(data: SessionData): Promise<void> {
  const cookieStore = await cookies()
  const encoded = Buffer.from(JSON.stringify(data)).toString("base64")
  cookieStore.set(SESSION_COOKIE, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  })
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
