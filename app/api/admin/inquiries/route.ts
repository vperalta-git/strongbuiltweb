import { NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, isValidAdminToken } from "@/lib/admin-session"
import { getContactInquiries } from "@/lib/contact-inquiry-store"

function isAuthorized(request: Request) {
  const cookie = request.headers.get("cookie") ?? ""
  const token = cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_COOKIE_NAME}=`))
    ?.split("=")[1]

  return isValidAdminToken(token)
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Admin login is required." }, { status: 401 })
  }

  const inquiries = await getContactInquiries()

  return NextResponse.json({ inquiries })
}
