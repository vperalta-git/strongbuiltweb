import { NextResponse } from "next/server"
import { addProduct, deleteProduct, getProducts, updateProduct } from "@/lib/server-product-store"
import { ADMIN_COOKIE_NAME, isValidAdminToken } from "@/lib/admin-session"

function isAuthorized(request: Request) {
  const cookie = request.headers.get("cookie") ?? ""
  const token = cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_COOKIE_NAME}=`))
    ?.split("=")[1]

  return isValidAdminToken(token)
}

function unauthorized() {
  return NextResponse.json({ message: "Admin login is required." }, { status: 401 })
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return unauthorized()
  }

  const products = await getProducts()

  return NextResponse.json({ products })
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return unauthorized()
  }

  try {
    const product = await addProduct(await request.formData())

    return NextResponse.json({ product })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to save product." },
      { status: 400 },
    )
  }
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return unauthorized()
  }

  try {
    const formData = await request.formData()
    const id = formData.get("id")
    const product = await updateProduct(typeof id === "string" ? id : "", formData)

    return NextResponse.json({ product })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to update product." },
      { status: 400 },
    )
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return unauthorized()
  }

  try {
    const { id } = (await request.json()) as { id?: string }

    await deleteProduct(id ?? "")

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to delete product." },
      { status: 400 },
    )
  }
}
