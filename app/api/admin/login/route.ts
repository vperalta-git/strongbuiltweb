import { NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, createAdminToken, getAdminCredentials } from "@/lib/admin-session"

export async function POST(request: Request) {
  let credentialsPayload: {
    username?: string
    password?: string
  }

  try {
    credentialsPayload = (await request.json()) as {
      username?: string
      password?: string
    }
  } catch {
    return NextResponse.json({ message: "Please enter a valid admin username and password." }, { status: 400 })
  }

  const { username, password } = credentialsPayload
  const credentials = getAdminCredentials()

  if (username !== credentials.username || password !== credentials.password) {
    return NextResponse.json({ message: "Invalid admin username or password." }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: createAdminToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  })

  return response
}
