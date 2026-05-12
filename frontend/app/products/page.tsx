"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Anchor,
  BadgeCheck,
  BriefcaseBusiness,
  Ear,
  Eye,
  Footprints,
  Hand,
  HardHat,
  Mountain,
  Shield,
  Shirt,
  Trash2,
  Wind,
  type LucideIcon,
} from "lucide-react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { productCategories, type CatalogProduct, type ProductCategoryName } from "@/lib/product-data"

const ALL_PRODUCTS = "All Products"

const categoryIcons: Record<ProductCategoryName, LucideIcon> = {
  "Foot Protection": Footprints,
  "Head Protection": HardHat,
  "Fall Protection": Anchor,
  "Eye and Face Protection": Eye,
  "Hearing Protection": Ear,
  "Respiratory Protection": Wind,
  "Hand Protection": Hand,
  Workwear: Shirt,
  "Outdoor Wear": Mountain,
  "Technical Wear": BriefcaseBusiness,
  "Disposable Wear": Trash2,
  ESD: Shield,
  "W/ DOLE Certificate": BadgeCheck,
}

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState(ALL_PRODUCTS)
  const [products, setProducts] = useState<CatalogProduct[]>([])

  useEffect(() => {
    let ignore = false

    async function loadProducts() {
      try {
        const response = await fetch("/api/products", { cache: "no-store" })

        if (!response.ok) {
          return
        }

        const data = (await response.json()) as { products?: CatalogProduct[] }

        if (!ignore && Array.isArray(data.products)) {
          setProducts(data.products)
        }
      } catch {
        setProducts([])
      }
    }

    loadProducts()

    return () => {
      ignore = true
    }
  }, [])

  const activeCategory = useMemo(
    () => productCategories.find((category) => category.name === selectedCategory),
    [selectedCategory],
  )

  const visibleProducts = useMemo(
    () => products.filter((product) => !activeCategory || product.category === activeCategory.name),
    [activeCategory, products],
  )

  const SectionIcon = activeCategory ? categoryIcons[activeCategory.name] : Shield

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-foreground py-16 text-background lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
            <div>
              <Badge className="bg-primary text-primary-foreground">Product Catalog</Badge>
              <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-balance sm:text-5xl">
                Industrial safety products for every worksite need
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-background/75 text-pretty">
                Explore TRACMAC's PPE selection across footwear, head protection, workwear, respiratory gear,
                and other essential safety categories.
              </p>
            </div>

            <div className="self-end">
              <label
                htmlFor="product-category"
                className="text-sm font-semibold uppercase tracking-wider text-background/70"
              >
                Category
              </label>
              <select
                id="product-category"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="mt-3 h-12 w-full rounded-md border border-background/20 bg-background px-4 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
              >
                <option value={ALL_PRODUCTS}>{ALL_PRODUCTS}</option>
                {productCategories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/15">
                  <SectionIcon className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">{activeCategory?.name ?? ALL_PRODUCTS}</h2>
                <p className="mt-3 text-muted-foreground">
                  {activeCategory?.description ??
                    "View the complete product catalog, or use the category dropdown to narrow the selection."}
                </p>
              </div>
              <Button asChild>
                <Link href="/#contact">{activeCategory ? "Request Category Quote" : "Request Product Quote"}</Link>
              </Button>
            </div>

            {visibleProducts.length ? (
              <div className="grid gap-6 md:grid-cols-3">
                {visibleProducts.map((product) => {
                  const ProductIcon = categoryIcons[product.category]

                  return (
                    <Card key={product.id} className="border-border transition-shadow hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="mb-5 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-muted">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ProductIcon className="h-16 w-16 text-muted-foreground/60" />
                          )}
                        </div>
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                            {product.category}
                          </p>
                          {product.badge && <Badge variant="secondary">{product.badge}</Badge>}
                        </div>
                        <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground">{product.name}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
                        <p className="mt-3 text-sm font-medium text-foreground">{product.spec}</p>
                      </CardContent>
                      <CardFooter className="p-6 pt-0">
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/#contact">Request Quote</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex min-h-52 flex-col items-center justify-center p-8 text-center">
                  <Shield className="h-12 w-12 text-muted-foreground/60" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">No products available yet</h3>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Products added by the admin will appear here automatically.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
