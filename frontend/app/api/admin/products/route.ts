import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, isValidAdminToken } from "@/lib/admin-session"
import { addAdminProduct, deleteAdminProduct, getAdminProducts, updateAdminProduct } from "@/lib/product-store"

export const runtime = "nodejs"

async function isAuthenticated() {
  const cookieStore = await cookies()

  return isValidAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "Admin login required." }, { status: 401 })
  }

  return NextResponse.json({ products: await getAdminProducts() })
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "Admin login required." }, { status: 401 })
  }

  try {
    const product = await addAdminProduct(await request.formData())

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to save product." },
      { status: 400 },
    )
  }
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "Admin login required." }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const id = formData.get("id")

    if (typeof id !== "string") {
      return NextResponse.json({ message: "Product ID is required." }, { status: 400 })
    }

    const product = await updateAdminProduct(id, formData)

    return NextResponse.json({ product })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to update product." },
      { status: 400 },
    )
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "Admin login required." }, { status: 401 })
  }

  try {
    const { id } = (await request.json()) as { id?: string }

    await deleteAdminProduct(id ?? "")

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to delete product." },
      { status: 400 },
    )
  }
}
