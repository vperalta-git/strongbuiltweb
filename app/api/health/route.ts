import { NextResponse } from "next/server"
import { getMongoDb } from "@/lib/mongodb"

export async function GET() {
  try {
    await getMongoDb().then((db) => db.command({ ping: 1 }))

    return NextResponse.json({
      ok: true,
      database: "connected",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        database: "disconnected",
        message: error instanceof Error ? error.message : "Database health check failed.",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }
}
