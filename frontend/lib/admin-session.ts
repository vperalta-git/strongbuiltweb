import crypto from "crypto"

export const ADMIN_COOKIE_NAME = "tracmac_admin_session"

const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? "change-this-tracmac-admin-secret"

function sign(value: string) {
  return crypto.createHmac("sha256", sessionSecret).update(value).digest("hex")
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "admin123",
  }
}

export function createAdminToken() {
  const payload = JSON.stringify({
    role: "admin",
    exp: Date.now() + 1000 * 60 * 60 * 8,
  })
  const encodedPayload = Buffer.from(payload).toString("base64url")

  return `${encodedPayload}.${sign(encodedPayload)}`
}

export function isValidAdminToken(token?: string) {
  if (!token) {
    return false
  }

  const [encodedPayload, signature] = token.split(".")

  if (!encodedPayload || !signature || sign(encodedPayload) !== signature) {
    return false
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as {
      exp?: number
      role?: string
    }

    return payload.role === "admin" && typeof payload.exp === "number" && payload.exp > Date.now()
  } catch {
    return false
  }
}
