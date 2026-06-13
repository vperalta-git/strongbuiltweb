import { NextResponse } from "next/server"
import { getProducts } from "@/lib/server-product-store"
import type { ProductSiteSlug } from "@/lib/product-data"

function readSite(request: Request): ProductSiteSlug | undefined {
  const site = new URL(request.url).searchParams.get("site")

  return site === "tracmac" || site === "strongbuilt" ? site : undefined
}

export async function GET(request: Request) {
  const products = await getProducts({ site: readSite(request) })

  return NextResponse.json({ products })
}
