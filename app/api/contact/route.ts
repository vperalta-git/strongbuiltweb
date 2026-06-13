import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { addContactInquiry } from "@/lib/contact-inquiry-store"

export async function POST(request: Request) {
  try {
    const inquiry = await addContactInquiry(await request.json())

    return NextResponse.json({ inquiry }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Invalid inquiry details." }, { status: 400 })
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to save your inquiry right now." },
      { status: 500 },
    )
  }
}
