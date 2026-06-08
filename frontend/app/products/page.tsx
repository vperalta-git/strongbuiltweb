"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Anchor,
  BadgeCheck,
  BriefcaseBusiness,
  Bookmark,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Ear,
  Eye,
  Feather,
  FileText,
  Footprints,
  Grid2X2,
  Hand,
  HardHat,
  Mountain,
  PackageOpen,
  Search,
  Shield,
  Shirt,
  SlidersHorizontal,
  Trash2,
  X,
  Wind,
  type LucideIcon,
} from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { QuoteLink } from "@/components/quote-link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { productBrands } from "@/lib/brand-data"
import { productCategories, type CatalogProduct, type ProductCategoryName } from "@/lib/product-data"

const ALL_PRODUCTS = "All Products"
const ALL_BRANDS = "All Brands"
const PRODUCTS_PER_PAGE = 16

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

const certificationOptions = ["CE Certified", "ANSI Approved", "EN Standard", "DOLE Certified"]
const filterGroups = ["Brand", "Product Type", "Certifications", "Industry", "Material", "Color"]
const featureChipIcons = [Wind, Feather, Shield, SlidersHorizontal]

function getProductFeatureChips(product: CatalogProduct) {
  const categoryFeatureMap: Partial<Record<ProductCategoryName, string[]>> = {
    "Head Protection": ["Breathable", "Lightweight", "Impact Resistant", "Adjustable Fit"],
    "Foot Protection": ["Slip Resistant", "Durable Build", "Toe Protection", "Worksite Ready"],
    "Fall Protection": ["Anchorage Ready", "Secure Fit", "Load Rated", "Height Safety"],
    "Eye and Face Protection": ["Clear Vision", "Impact Resistant", "Comfort Fit", "Anti-Scratch"],
    "Hearing Protection": ["Noise Reduction", "Lightweight", "Comfort Pads", "Adjustable Fit"],
    "Respiratory Protection": ["Airflow Support", "Secure Seal", "Reusable", "Filter Ready"],
    "Hand Protection": ["Grip Support", "Cut Aware", "Flexible Fit", "Durable Palm"],
    Workwear: ["High Visibility", "Comfort Fit", "Daily Wear", "Site Ready"],
    "Outdoor Wear": ["Weather Ready", "Lightweight", "Waterproof", "Field Tested"],
  }

  return categoryFeatureMap[product.category] ?? ["Certified", "Durable", "Comfort Fit", "Industrial Use"]
}

function getProductFeatures(product: CatalogProduct) {
  return [
    `${product.category} design for demanding work environments`,
    product.spec.split(";")[0] || "Specification-ready product details",
    "Comfortable fit for extended daily use",
    "Suitable for procurement and compliance review",
    "Reliable brand option for industrial teams",
    "Available for quote and supply coordination",
  ]
}

function getSpecRows(product: CatalogProduct) {
  const specParts = product.spec
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6)

  const fallbackSpecs = [
    ["Category", product.category],
    ["Brand", product.brand],
    ["Use Case", "Industrial PPE"],
    ["Availability", "Quote upon request"],
    ["Support", "Catalog-ready assistance"],
    ["Certification", product.category === "W/ DOLE Certificate" ? "DOLE documentation" : "Upon request"],
  ]

  if (!specParts.length) {
    return fallbackSpecs
  }

  return specParts.map((value, index) => [fallbackSpecs[index]?.[0] ?? `Spec ${index + 1}`, value])
}

function getSpecTags(product: CatalogProduct) {
  const knownTerms = [
    "HDPE",
    "8-Point",
    "UV Resistant",
    "Adjustable",
    "Nitrile",
    "Waterproof",
    "Lightweight",
    "Anti-Fog",
    "Composite",
    "Reflective",
  ]
  const source = `${product.name} ${product.description} ${product.spec}`.toLowerCase()
  const tags = knownTerms.filter((term) => source.includes(term.toLowerCase())).slice(0, 3)

  return tags.length ? tags : getProductFeatureChips(product).slice(0, 2)
}

const colorOptions = [
  { name: "Navy Blue / Orange", className: "bg-gradient-to-br from-[#14365d] via-[#14365d] to-orange-500" },
  { name: "Grey / Yellow", className: "bg-gradient-to-br from-slate-400 via-slate-400 to-yellow-400" },
  { name: "Fluorescent Yellow / Grey", className: "bg-gradient-to-br from-lime-300 via-yellow-300 to-slate-400" },
  { name: "Black / Red", className: "bg-gradient-to-br from-black via-black to-red-600" },
]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState(ALL_PRODUCTS)
  const [selectedBrand, setSelectedBrand] = useState(ALL_BRANDS)
  const [brandSearchQuery, setBrandSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const category = params.get("category")
    const brand = params.get("brand")

    if (category && productCategories.some((item) => item.name === category)) {
      setSelectedCategory(category)
    }

    if (brand) {
      setSelectedBrand(brand)
    }

    fetch("/api/products", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Unable to load products."))))
      .then((data: { products?: CatalogProduct[] }) => setProducts(data.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedBrand, selectedCategory])

  const activeCategory = useMemo(
    () => productCategories.find((category) => category.name === selectedCategory),
    [selectedCategory],
  )

  const brands = useMemo(() => {
    const productBrandNames = new Set(products.map((product) => product.brand).filter(Boolean))

    return productBrands
      .map((brand) => brand.name)
      .filter((brand) => productBrandNames.has(brand))
      .concat(Array.from(productBrandNames).filter((brand) => !productBrands.some((item) => item.name === brand)))
  }, [products])

  const visibleBrands = useMemo(() => {
    const query = brandSearchQuery.trim().toLowerCase()

    return brands.filter((brand) => !query || brand.toLowerCase().includes(query)).slice(0, 5)
  }, [brandSearchQuery, brands])

  const visibleProducts = useMemo(() => {
    const filteredProducts = products.filter((product) => {
      const matchesCategory = !activeCategory || product.category === activeCategory.name
      const matchesBrand = selectedBrand === ALL_BRANDS || product.brand === selectedBrand

      return matchesCategory && matchesBrand
    })

    return [...filteredProducts].sort((a, b) => Number(Boolean(b.imageUrl)) - Number(Boolean(a.imageUrl)))
  }, [activeCategory, products, selectedBrand])

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()

    products.forEach((product) => {
      counts.set(product.category, (counts.get(product.category) ?? 0) + 1)
    })

    return counts
  }, [products])

  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / PRODUCTS_PER_PAGE))
  const pageStart = visibleProducts.length ? (currentPage - 1) * PRODUCTS_PER_PAGE : 0
  const pageEnd = Math.min(pageStart + PRODUCTS_PER_PAGE, visibleProducts.length)
  const pageProducts = visibleProducts.slice(pageStart, pageEnd)

  const selectedProduct = useMemo(
    () => visibleProducts.find((product) => product.id === selectedProductId) ?? visibleProducts[0] ?? null,
    [selectedProductId, visibleProducts],
  )

  const categoryOptions = [{ name: ALL_PRODUCTS, description: "View every available product" }, ...productCategories]
  const DetailIcon = selectedProduct ? categoryIcons[selectedProduct.category] : PackageOpen

  function openProduct(productId: string) {
    setSelectedProductId(productId)
    setIsProductDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <Header />
      <main className="border-t border-slate-200/70">
        <section className="relative overflow-hidden bg-[#fbfaf7] py-7 lg:py-10">
          <div
            className="pointer-events-none absolute right-0 top-0 h-72 w-72 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, #f26700 2px, transparent 2px)",
              backgroundSize: "18px 18px",
            }}
          />
          <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
              <aside className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-2">
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-900/6">
                  <div className="flex items-center gap-3 bg-[#0b2038] px-4 py-3.5 text-white">
                    <Grid2X2 className="h-4 w-4" />
                    <p className="text-sm font-bold uppercase tracking-[0.08em]">Product Categories</p>
                    <ChevronDown className="ml-auto h-4 w-4 rotate-180 text-white/75" />
                  </div>
                  <div className="py-1.5">
                    {categoryOptions.map((category) => {
                      const isActive = selectedCategory === category.name
                      const CategoryIcon = category.name === ALL_PRODUCTS ? Grid2X2 : categoryIcons[category.name as ProductCategoryName]
                      const count = category.name === ALL_PRODUCTS ? products.length : categoryCounts.get(category.name) ?? 0

                      return (
                        <button
                          key={category.name}
                          type="button"
                          onClick={() => setSelectedCategory(category.name)}
                          className={`flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm font-medium transition ${
                            isActive ? "bg-orange-50 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                          }`}
                        >
                          {CategoryIcon && <CategoryIcon className="h-4 w-4 shrink-0" />}
                          <span className="min-w-0 flex-1 truncate">{category.name}</span>
                          <span
                            className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                              isActive ? "bg-white text-primary" : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-900/6">
                  <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#0b2038]">Filters</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBrand(ALL_BRANDS)
                        setBrandSearchQuery("")
                      }}
                      className="text-xs font-bold text-primary hover:text-orange-700"
                    >
                      Clear all
                    </button>
                  </div>
                  {filterGroups.map((group) => (
                    <div key={group} className="border-b border-slate-200 last:border-b-0">
                      <div className="flex items-center justify-between px-4 py-3">
                        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#0b2038]">{group}</p>
                        <ChevronDown className="h-4 w-4 text-[#24384a]" />
                      </div>

                      {group === "Brand" && (
                        <div className="px-4 pb-4">
                          <label className="relative block">
                            <span className="sr-only">Search brands</span>
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              value={brandSearchQuery}
                              onChange={(event) => setBrandSearchQuery(event.target.value)}
                              placeholder="Search brands..."
                              className="h-9 rounded-md border-slate-200 bg-white pl-9 text-sm"
                            />
                          </label>
                          <div className="mt-4 space-y-2.5">
                            {visibleBrands.map((brand) => (
                              <label key={brand} className="flex items-center gap-2 text-sm text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={selectedBrand === brand}
                                  onChange={() => setSelectedBrand(selectedBrand === brand ? ALL_BRANDS : brand)}
                                  className="h-3.5 w-3.5 rounded border-slate-300 accent-orange-600"
                                />
                                {brand}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {group === "Certifications" && (
                        <div className="space-y-2.5 px-4 pb-4">
                          {certificationOptions.map((certification) => (
                            <label key={certification} className="flex items-center gap-2 text-sm text-slate-600">
                              <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300 accent-orange-600" />
                              {certification}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </aside>

              <div className="min-w-0">
                <div className="flex flex-col gap-6 pb-6 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Product Catalog</p>
                    <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-[#0b2038] sm:text-5xl">
                      All Products
                    </h1>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                      Browse our complete range of safety and protective equipment engineered for performance and built
                      for protection.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="h-12 border-primary px-6 text-primary hover:bg-primary hover:text-primary-foreground"
                    asChild
                  >
                    <QuoteLink
                      context={
                        activeCategory
                          ? { type: "category", value: activeCategory.name }
                          : { type: "general", value: "PPE quote" }
                      }
                    >
                      Request Product Quote
                    </QuoteLink>
                  </Button>
                </div>

                {isLoading ? (
                  <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
                    Loading catalog products...
                  </div>
                ) : pageProducts.length ? (
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {pageProducts.map((product) => {
                      const ProductIcon = categoryIcons[product.category]
                      const specTags = getSpecTags(product)

                      return (
                        <article
                          key={product.id}
                          className="group flex min-h-[545px] flex-col overflow-hidden rounded-lg border border-[#d6dee8] bg-white shadow-lg shadow-slate-900/6 transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-slate-900/12"
                        >
                          <div className="h-1 bg-primary transition-all duration-300 group-hover:h-1.5" />
                          <div className="relative flex h-56 min-h-[220px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#eef3f7] via-[#f2f5f8] to-[#dfe7ee] p-7">
                            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0f2435]/10 to-transparent" />
                            <BrandMark brand={product.brand} badge className="absolute right-4 top-4 z-20" />
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.03]"
                              />
                            ) : (
                              <div className="flex h-40 w-40 flex-col items-center justify-center rounded-lg bg-white/80 text-center text-slate-500 shadow-inner">
                                <ProductIcon className="h-11 w-11 text-slate-400" />
                                <p className="mt-5 text-sm leading-5">Product image coming soon</p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-1 flex-col p-5">
                            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#53677a]">{product.brand}</p>
                            <p className="mt-2 text-xs font-bold text-[#53677a]">{product.category}</p>
                            <h2 className="mt-3 line-clamp-2 text-xl font-bold leading-snug text-[#0b2038]">{product.name}</h2>
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{product.description}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {specTags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-md bg-[#e8eef4] px-2.5 py-1 text-[11px] font-bold text-[#24384a]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="mt-auto grid grid-cols-2 gap-3 pt-7">
                              <Button
                                type="button"
                                variant="outline"
                                className="border-slate-300 bg-white text-[#0b2038] hover:bg-slate-50"
                                onClick={() => openProduct(product.id)}
                              >
                                View Details
                              </Button>
                              <Button asChild>
                                <QuoteLink context={{ type: "product", value: product.name }}>Request Quote</QuoteLink>
                              </Button>
                            </div>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                ) : (
                  <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
                    <PackageOpen className="mx-auto h-12 w-12 text-slate-400" />
                    <h2 className="mt-4 text-lg font-semibold text-[#0b2038]">No products match your filters</h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                      Try a different keyword, category, or brand to broaden the catalog results.
                    </p>
                  </div>
                )}

                {pageCount > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                      className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:border-primary hover:text-primary disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: Math.min(pageCount, 4) }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`h-10 w-10 rounded-md border text-sm font-semibold transition ${
                          currentPage === page
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                      disabled={currentPage === pageCount}
                      className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:border-primary hover:text-primary disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <Dialog
          open={isProductDialogOpen}
          onOpenChange={(open) => {
            setIsProductDialogOpen(open)
            if (!open) {
              setSelectedProductId(null)
            }
          }}
        >
          <DialogContent className="max-h-[92vh] max-w-[calc(100%-2rem)] overflow-y-auto border-slate-200 bg-white p-0 shadow-2xl shadow-black/25 sm:max-w-6xl">
            {selectedProduct ? (
              <div className="grid gap-0 lg:grid-cols-[430px_minmax(0,1fr)]">
                <div className="border-r border-slate-200 bg-gradient-to-b from-[#f2f5f8] via-white to-orange-50/35 p-6 lg:p-8">
                  <div className="grid gap-4 lg:grid-cols-[72px_minmax(0,1fr)]">
                    <div className="order-2 grid grid-cols-4 gap-3 lg:order-1 lg:grid-cols-1">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`flex aspect-square items-center justify-center overflow-hidden rounded-lg border bg-white p-2 shadow-sm transition ${
                            index === 0 ? "border-primary ring-1 ring-primary" : "border-slate-200 hover:border-primary/50"
                          }`}
                        >
                          {selectedProduct.imageUrl ? (
                            <img src={selectedProduct.imageUrl} alt="" className="h-full w-full object-contain" />
                          ) : (
                            <DetailIcon className="h-8 w-8 text-slate-400" />
                          )}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="hidden items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-[#0b2038] shadow-sm lg:flex"
                      >
                        <ChevronDown className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="order-1 lg:order-2">
                      <div className="flex items-center justify-between gap-3 pr-8">
                        <Badge className="bg-[#0b2038] text-white shadow-sm">Selected Product</Badge>
                        <BrandMark brand={selectedProduct.brand} compact className="bg-white" />
                      </div>

                      <div className="relative mt-7 overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-[#eef3f7] via-[#f2f5f8] to-[#dfe7ee] p-6 shadow-inner">
                        <button
                          type="button"
                          className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-md bg-white/85 px-3 py-2 text-xs font-bold text-[#0b2038] shadow-sm"
                        >
                          <Search className="h-3.5 w-3.5" />
                          Zoom
                        </button>
                        <div className="flex aspect-[4/3] w-full items-center justify-center">
                          {selectedProduct.imageUrl ? (
                            <img
                              src={selectedProduct.imageUrl}
                              alt={selectedProduct.name}
                              className="h-full w-full object-contain drop-shadow-sm"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-lg bg-white/70">
                              <DetailIcon className="h-16 w-16 text-orange-600" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7">
                    <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#0b2038]">Available Colors</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {colorOptions.map((color, index) => (
                        <span
                          key={color.name}
                          className={`h-7 w-7 rounded-full shadow-inner ring-2 ${
                            index === 0 ? "ring-primary" : "ring-slate-200"
                          } ${color.className}`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col p-6 lg:p-9">
                  <DialogHeader className="text-left">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                      <span>Home</span>
                      <ChevronRight className="h-3 w-3" />
                      <span>{selectedProduct.category}</span>
                      <ChevronRight className="h-3 w-3" />
                      <span className="text-[#0b2038]">{selectedProduct.name}</span>
                    </div>
                    <DialogDescription className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary">
                      {selectedProduct.brand}
                    </DialogDescription>
                    <DialogTitle className="text-4xl font-extrabold leading-tight text-[#0b2038]">
                      {selectedProduct.name}
                    </DialogTitle>
                    <div className="mt-2">
                      <Badge className="bg-[#e8eef4] text-[#123b72] hover:bg-[#e8eef4]">{selectedProduct.category}</Badge>
                    </div>
                    <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{selectedProduct.description}</p>
                  </DialogHeader>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {getProductFeatureChips(selectedProduct).map((feature, index) => {
                      const FeatureIcon = featureChipIcons[index] ?? BadgeCheck

                      return (
                        <div
                          key={feature}
                          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0b2038] shadow-sm"
                        >
                          <FeatureIcon className="h-5 w-5 text-[#123b72]" />
                          {feature}
                        </div>
                      )
                    })}
                  </div>

                  <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#123b72]">Key Features</h3>
                      <ChevronDown className="h-4 w-4 rotate-180 text-[#123b72]" />
                    </div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {getProductFeatures(selectedProduct).map((feature) => (
                        <div key={feature} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#123b72]">Specifications</h3>
                      <ChevronDown className="h-4 w-4 rotate-180 text-[#123b72]" />
                    </div>
                    <div className="mt-5 grid overflow-hidden rounded-md border border-slate-200 sm:grid-cols-2">
                      {getSpecRows(selectedProduct).map(([label, value]) => (
                        <div key={`${label}-${value}`} className="grid grid-cols-[115px_minmax(0,1fr)] border-b border-slate-200 text-sm last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
                          <div className="bg-slate-50 px-3 py-3 font-bold text-slate-600">{label}</div>
                          <div className="px-3 py-3 text-slate-700">{value}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="mt-auto grid gap-4 pt-8 sm:grid-cols-2">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 border-[#123b72] text-[#0b2038] hover:bg-slate-50"
                      asChild
                    >
                      <QuoteLink context={{ type: "product", value: selectedProduct.name }}>
                        <Bookmark className="h-5 w-5" />
                        Add to Inquiry
                      </QuoteLink>
                    </Button>
                    <Button size="lg" className="h-12" asChild>
                      <QuoteLink context={{ type: "product", value: selectedProduct.name }}>
                        <FileText className="h-5 w-5" />
                        Request Quote
                      </QuoteLink>
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  )
}
