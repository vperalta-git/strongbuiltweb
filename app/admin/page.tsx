"use client"

import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import Cropper, { type Area } from "react-easy-crop"
import {
  Bell,
  Boxes,
  ChevronDown,
  ClipboardList,
  Eye,
  EyeOff,
  ExternalLink,
  FolderOpen,
  HardDrive,
  Home,
  ImagePlus,
  LockKeyhole,
  LogOut,
  Menu,
  PackagePlus,
  Pencil,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Tags,
  Trash2,
  UsersRound,
  UserRound,
  X,
} from "lucide-react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { BrandMark } from "@/components/brand-mark"
import tmacLogo from "@/assets/tmaclogo.png"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { productBrands } from "@/lib/brand-data"
import { productCategories } from "@/lib/product-data"
import type { CatalogProduct } from "@/lib/product-data"
import { siteConfigs } from "@/lib/site-config"

const adminNavItems = [
  { label: "Dashboard", icon: Home },
  { label: "Products", icon: PackagePlus },
  { label: "Categories", icon: FolderOpen },
  { label: "Brands", icon: Tags },
  { label: "Orders / Quotes", icon: ClipboardList },
  { label: "Users", icon: UsersRound },
  { label: "Settings", icon: Settings2 },
] as const

const catalogSites = [siteConfigs.tracmac, siteConfigs.strongbuilt]

type AdminSection = (typeof adminNavItems)[number]["label"]
type ContactInquiry = {
  id: string
  name: string
  company?: string
  email: string
  phone?: string
  message: string
  inquiryContext?: string
  status: "new"
  createdAt: string
}

async function createCroppedImageFile(imageSrc: string, crop: Area, type: string, name: string) {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new globalThis.Image()

    element.onload = () => resolve(element)
    element.onerror = () => reject(new Error("Unable to prepare the cropped image."))
    element.src = imageSrc
  })
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

  if (!context) {
    throw new Error("Image cropping is not supported in this browser.")
  }

  canvas.width = crop.width
  canvas.height = crop.height
  context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => (value ? resolve(value) : reject(new Error("Unable to crop the selected image."))), type, 0.92)
  })

  return new File([blob], name, { type })
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingProductId, setDeletingProductId] = useState("")
  const [message, setMessage] = useState("")
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [imageCrop, setImageCrop] = useState({ x: 0, y: 0 })
  const [imageZoom, setImageZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [imageInputKey, setImageInputKey] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [productSearchQuery, setProductSearchQuery] = useState("")
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false)
  const [formResetKey, setFormResetKey] = useState(0)
  const [activeAdminSection, setActiveAdminSection] = useState<AdminSection>("Products")

  const visibleAdminProducts = products.filter((product) => {
    const query = productSearchQuery.trim().toLowerCase()

    if (!query) {
      return true
    }

    return [product.name, product.brand, product.category, product.site, product.description, product.spec, product.badge]
      .filter(Boolean)
      .some((value) => value?.toLowerCase().includes(query))
  })
  const productsWithImages = products.filter((product) => Boolean(product.imageUrl)).length
  const demoProductCount = products.filter((product) => product.isDemo).length
  const adminProductCount = products.length - demoProductCount
  const categorySummaries = productCategories.map((category) => ({
    ...category,
    count: products.filter((product) => product.category === category.name).length,
  }))
  const siteSummaries = catalogSites.map((site) => ({
    ...site,
    count: products.filter((product) => product.site === site.slug).length,
  }))
  const brandSummaries = productBrands.map((brand) => ({
    ...brand,
    count: products.filter((product) => product.brand === brand.name).length,
  }))

  const adminSectionCopy: Record<AdminSection, { title: string; description: string }> = {
    Dashboard: {
      title: "Admin dashboard",
      description: "Monitor catalog coverage, product counts, and current admin storage status.",
    },
    Products: {
      title: "Manage the shared product catalog",
      description: "Add product names, images, descriptions, categories, and assign each record to Tracmac or Strongbuilt.",
    },
    Categories: {
      title: "Manage product categories",
      description: "Review category coverage and jump back into products when a category needs more catalog items.",
    },
    Brands: {
      title: "Manage product brands",
      description: "Review supported TRACMAC supplier brands and how many products are currently assigned to each brand.",
    },
    "Orders / Quotes": {
      title: "Orders and quotes",
      description: "Track quote requests and procurement conversations as the catalog workflow grows.",
    },
    Users: {
      title: "Admin users",
      description: "Review admin access status and session controls for the product catalog system.",
    },
    Settings: {
      title: "Admin settings",
      description: "Check storage behavior, image upload limits, and catalog publishing settings.",
    },
  }

  async function loadAdminProducts() {
    const response = await fetch("/api/admin/products", { cache: "no-store" })

    if (response.status === 401) {
      setIsAuthenticated(false)
      setProducts([])
      return
    }

    if (response.ok) {
      const data = (await response.json()) as { products?: CatalogProduct[] }
      setProducts(data.products ?? [])
      setIsAuthenticated(true)
    }
  }

  async function loadInquiries() {
    setIsLoadingInquiries(true)

    try {
      const response = await fetch("/api/admin/inquiries", { cache: "no-store" })

      if (response.status === 401) {
        setIsAuthenticated(false)
        setInquiries([])
        return
      }

      if (response.ok) {
        const data = (await response.json()) as { inquiries?: ContactInquiry[] }
        setInquiries(data.inquiries ?? [])
      }
    } finally {
      setIsLoadingInquiries(false)
    }
  }

  useEffect(() => {
    loadAdminProducts().finally(() => setIsCheckingSession(false))
  }, [])

  useEffect(() => {
    if (isAuthenticated && activeAdminSection === "Orders / Quotes") {
      loadInquiries()
    }
  }, [activeAdminSection, isAuthenticated])

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("")

    const formData = new FormData(event.currentTarget)
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    })

    if (!response.ok) {
      const data = (await response.json()) as { message?: string }
      setMessage(data.message ?? "Unable to login.")
      return
    }

    setIsAuthenticated(true)
    setMessage("Welcome back. You can add products now.")
    await loadAdminProducts()
    await loadInquiries()
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    setIsAuthenticated(false)
    setProducts([])
    setInquiries([])
    setEditingProduct(null)
    setMessage("")
  }

  function handleEditProduct(product: CatalogProduct) {
    setEditingProduct(product)
    setPreviewUrl(product.imageUrl ?? "")
    setSelectedImageFile(null)
    setCroppedAreaPixels(null)
    setImageCrop({ x: 0, y: 0 })
    setImageZoom(1)
    setImageInputKey((current) => current + 1)
    setMessage("")
  }

  function handleCancelEdit() {
    setEditingProduct(null)
    setPreviewUrl("")
    setSelectedImageFile(null)
    setCroppedAreaPixels(null)
    setImageCrop({ x: 0, y: 0 })
    setImageZoom(1)
    setImageInputKey((current) => current + 1)
    setMessage("")
    setFormResetKey((current) => current + 1)
  }

  function handleClearProductForm() {
    handleCancelEdit()
  }

  async function handleProductSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setMessage("")

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      if (editingProduct) {
        formData.set("id", editingProduct.id)
      }

      if (selectedImageFile && previewUrl && croppedAreaPixels) {
        const croppedImage = await createCroppedImageFile(
          previewUrl,
          croppedAreaPixels,
          selectedImageFile.type,
          selectedImageFile.name,
        )

        formData.set("image", croppedImage)
      }

      const response = await fetch("/api/admin/products", {
        method: editingProduct ? "PATCH" : "POST",
        body: formData,
      })

      setIsSaving(false)

      const data = (await response.json()) as {
        message?: string
        product?: CatalogProduct
      }

      if (!response.ok) {
        setMessage(data.message ?? "Unable to save product.")
        return
      }

      const savedProduct = data.product

      if (savedProduct) {
        setProducts((currentProducts: CatalogProduct[]) =>
          editingProduct
            ? currentProducts.map((product: CatalogProduct) => (product.id === savedProduct.id ? savedProduct : product))
            : [savedProduct, ...currentProducts],
        )
      }
    } catch (error) {
      setIsSaving(false)
      setMessage(error instanceof Error ? error.message : "Unable to save product.")
      return
    }

    form.reset()
    setEditingProduct(null)
    setPreviewUrl("")
    setSelectedImageFile(null)
    setCroppedAreaPixels(null)
    setImageCrop({ x: 0, y: 0 })
    setImageZoom(1)
    setImageInputKey((current) => current + 1)
    setFormResetKey((current) => current + 1)
    setMessage(editingProduct ? "Product updated." : "Product saved and published to the catalog.")
  }

  async function handleDeleteProduct(product: CatalogProduct) {
    if (!window.confirm(`Delete "${product.name}" from the catalog?`)) {
      return
    }

    setDeletingProductId(product.id)
    setMessage("")

    const response = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id }),
    })

    setDeletingProductId("")

    const data = (await response.json()) as { message?: string }

    if (!response.ok) {
      setMessage(data.message ?? "Unable to delete product.")
      return
    }

    setProducts((currentProducts: CatalogProduct[]) =>
      currentProducts.filter((item: CatalogProduct) => item.id !== product.id),
    )

    if (editingProduct?.id === product.id) {
      setEditingProduct(null)
      setPreviewUrl("")
      setSelectedImageFile(null)
      setCroppedAreaPixels(null)
      setImageCrop({ x: 0, y: 0 })
      setImageZoom(1)
      setImageInputKey((current) => current + 1)
    }

    setMessage("Product deleted.")
  }

  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      {!isAuthenticated && <Header />}
      <main className={!isAuthenticated ? "border-t border-slate-200/70" : ""}>
        <section className={isAuthenticated ? "p-0" : isCheckingSession ? "py-12 lg:py-16" : "p-0"}>
          <div className={isAuthenticated ? "" : isCheckingSession ? "section-shell" : ""}>
            {isCheckingSession ? (
              <Card className="surface-card">
                <CardContent className="p-6 text-sm text-muted-foreground">Checking admin session...</CardContent>
              </Card>
            ) : !isAuthenticated ? (
              <div className="grid min-h-[calc(100vh-5rem)] bg-[#faf7f2] lg:grid-cols-[minmax(0,1.05fr)_minmax(460px,0.95fr)]">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#061625] via-[#0f2435] to-[#102d45] px-6 py-14 text-white sm:px-10 lg:flex lg:items-center lg:px-16 lg:py-20 lg:[clip-path:polygon(0_0,100%_0,84%_100%,0_100%)]">
                  <div
                    className="pointer-events-none absolute bottom-14 left-0 h-44 w-52 opacity-[0.14]"
                    style={{
                      backgroundImage: "radial-gradient(circle, #f26700 1.4px, transparent 1.4px)",
                      backgroundSize: "18px 18px",
                    }}
                  />
                  <Settings2 className="pointer-events-none absolute right-20 top-20 h-44 w-44 rotate-12 text-white/[0.035]" />
                  <Settings2 className="pointer-events-none absolute bottom-16 right-10 h-32 w-32 -rotate-12 text-orange-500/[0.08]" />
                  <div className="relative z-10 max-w-xl">
                    <Badge className="bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground shadow-lg shadow-orange-950/30">
                      Admin
                    </Badge>
                    <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-normal text-balance sm:text-5xl lg:text-6xl">
                      Manage the <span className="text-primary">shared</span> product catalog
                    </h1>
                    <div className="mt-6 h-0.5 w-16 rounded-full bg-primary" />
                    <p className="mt-7 max-w-lg text-base leading-8 text-white/76 sm:text-lg">
                      Add product names, images, descriptions, categories, and assign each item to Tracmac or
                      Strongbuilt.
                    </p>

                    <div className="mt-10 grid gap-4 sm:grid-cols-3">
                      {[
                        { label: "Secure Access", icon: ShieldCheck },
                        { label: "Easy Management", icon: Boxes },
                        { label: "Real-time Updates", icon: RefreshCw },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3 border-white/10 sm:border-r sm:last:border-r-0">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-orange-400/20 bg-[#1b3044] text-primary shadow-inner">
                            <item.icon className="h-4 w-4" />
                          </span>
                          <span className="max-w-24 text-sm font-bold leading-5 text-white">{item.label}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      className="mt-10 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                      asChild
                    >
                      <Link href="/products">View Catalog</Link>
                    </Button>
                  </div>
                </div>

                <div className="relative flex items-center justify-center overflow-hidden px-4 py-12 sm:px-8 lg:px-12">
                  <div
                    className="pointer-events-none absolute right-8 top-8 h-52 w-52 opacity-[0.16]"
                    style={{
                      backgroundImage: "radial-gradient(circle, #f26700 1.4px, transparent 1.4px)",
                      backgroundSize: "18px 18px",
                    }}
                  />
                  <Settings2 className="pointer-events-none absolute bottom-16 right-12 h-36 w-36 text-[#d6dee8]/45" />
                  <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-8 bg-primary lg:block lg:-skew-x-12" />

                  <Card className="relative z-10 w-full max-w-xl rounded-xl border border-[#d6dee8] bg-white shadow-2xl shadow-slate-900/12">
                    <CardHeader className="items-center px-6 pb-4 pt-8 text-center sm:px-8">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-orange-100 text-primary">
                        <LockKeyhole className="h-7 w-7" />
                      </div>
                      <CardTitle className="mt-4 text-3xl font-extrabold text-[#061625]">Admin Login</CardTitle>
                      <p className="text-sm text-[#53677a]">Please enter your credentials to continue</p>
                    </CardHeader>
                    <CardContent className="px-6 pb-8 sm:px-8">
                      <form className="space-y-5" onSubmit={handleLogin}>
                        <div className="space-y-2">
                          <Label htmlFor="username" className="font-semibold text-[#0f2435]">
                            Username
                          </Label>
                          <div className="relative">
                            <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#53677a]" />
                            <Input
                              id="username"
                              name="username"
                              autoComplete="username"
                              placeholder="Enter your username"
                              className="h-12 border-[#d6dee8] bg-white pl-11 text-[#0f2435] focus-visible:border-primary focus-visible:ring-primary/20"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="font-semibold text-[#0f2435]">
                            Password
                          </Label>
                          <div className="relative">
                            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#53677a]" />
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              autoComplete="current-password"
                              placeholder="Enter your password"
                              className="h-12 border-[#d6dee8] bg-white px-11 text-[#0f2435] focus-visible:border-primary focus-visible:ring-primary/20"
                              required
                            />
                            <button
                              type="button"
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#53677a] transition hover:text-[#0f2435]"
                              onClick={() => setShowPassword((current) => !current)}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        {message && <p className="text-sm font-medium text-destructive">{message}</p>}
                        <Button
                          className="h-12 w-full bg-primary font-bold text-white shadow-lg shadow-orange-950/15 hover:bg-[#d95400]"
                          type="submit"
                        >
                          Login
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="min-h-screen bg-[#f6f8fb] text-[#0f2435] lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
                <aside className="flex flex-col bg-gradient-to-b from-[#061625] via-[#0f2435] to-[#102d45] px-3 py-5 text-white lg:min-h-screen">
                  <div className="flex items-center justify-between px-3">
                    <Image src={tmacLogo} alt="TRACMAC Marketing logo" className="h-12 w-auto object-contain" priority />
                    <button
                      type="button"
                      className="rounded-md p-2 text-white/80 transition hover:bg-white/10 hover:text-white lg:hidden"
                      aria-label="Open admin menu"
                    >
                      <Menu className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-9 px-3 text-xs font-bold uppercase tracking-[0.16em] text-white/48">Admin Panel</div>
                  <nav className="mt-5 space-y-1.5">
                    {adminNavItems.map((item) => {
                      const isActive = item.label === activeAdminSection

                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setActiveAdminSection(item.label)}
                          className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-semibold transition ${
                            isActive
                              ? "border-l-2 border-primary bg-white/10 text-primary shadow-inner"
                              : "text-white/86 hover:bg-white/8 hover:text-white"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </button>
                      )
                    })}
                  </nav>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-8 flex w-full items-center gap-3 rounded-md bg-white/8 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/12 lg:mt-auto"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </aside>

                <div className="min-w-0">
                  <header className="sticky top-0 z-30 border-b border-[#d6dee8] bg-[#061625] text-white shadow-sm lg:h-[73px]">
                    <div className="flex min-h-[73px] flex-wrap items-center gap-5 px-5 sm:px-8">
                      <button
                        type="button"
                        className="hidden rounded-md p-2 text-white/80 transition hover:bg-white/10 hover:text-white lg:inline-flex"
                        aria-label="Toggle sidebar"
                      >
                        <Menu className="h-5 w-5" />
                      </button>
                      <nav className="hidden items-center gap-7 text-sm font-bold lg:flex">
                        {adminNavItems.map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => setActiveAdminSection(item.label)}
                            className={`relative py-6 ${
                              item.label === activeAdminSection
                                ? "text-white after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"
                                : "text-white/75 transition hover:text-white"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </nav>
                      <div className="ml-auto flex items-center gap-5">
                        <button type="button" className="relative text-white/86 transition hover:text-white" aria-label="Notifications">
                          <Bell className="h-5 w-5" />
                          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                            3
                          </span>
                        </button>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0f2435]">
                            <UserRound className="h-5 w-5" />
                          </div>
                          <div className="hidden leading-tight sm:block">
                            <p className="text-sm font-bold">Admin</p>
                            <p className="text-xs text-white/64">Administrator</p>
                          </div>
                          <ChevronDown className="h-4 w-4 text-white/70" />
                        </div>
                      </div>
                    </div>
                  </header>

                  <div className="px-5 py-8 sm:px-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h1 className="text-3xl font-extrabold leading-tight text-[#061625]">
                          {adminSectionCopy[activeAdminSection].title}
                        </h1>
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#53677a]">
                          {adminSectionCopy[activeAdminSection].description}
                        </p>
                      </div>
                      <Button className="h-11 bg-primary px-5 font-bold text-white shadow-lg shadow-orange-950/10 hover:bg-[#d95400]" asChild>
                        <Link href="/products">
                          View Catalog
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>

                    <Alert className="mt-6 flex items-start gap-4 border-orange-200 bg-orange-50/85 text-[#0f2435] shadow-sm">
                      <HardDrive className="mt-0.5 h-5 w-5 text-primary" />
                      <div className="min-w-0 flex-1">
                        <AlertTitle className="font-extrabold">Shared MongoDB catalog is in use</AlertTitle>
                        <AlertDescription className="text-sm text-[#53677a]">
                          Tracmac and Strongbuilt use the same products collection. The Website field controls which catalog shows each product.
                        </AlertDescription>
                      </div>
                      <Button type="button" variant="outline" size="sm" className="hidden border-[#d6dee8] bg-white text-[#0f2435] sm:inline-flex">
                        Learn More
                      </Button>
                    </Alert>

                    {activeAdminSection === "Products" ? (
                    <div className="mt-6 grid gap-7 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
                <Card className="overflow-hidden rounded-lg border border-[#d6dee8] bg-white shadow-lg shadow-slate-900/6">
                  <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-[#e8eef4] px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-100 text-primary">
                        <PackagePlus className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg font-extrabold text-[#0b2038]">
                        {editingProduct ? "Edit Product" : "Add New Product"}
                      </CardTitle>
                    </div>
                    <Button type="button" variant="outline" size="sm" className="border-[#d6dee8]" onClick={handleClearProductForm}>
                      Clear Form
                    </Button>
                  </CardHeader>
                  <CardContent className="p-5">
                    <form
                      key={`${editingProduct?.id ?? "new-product"}-${formResetKey}`}
                      className="grid gap-5"
                      onSubmit={handleProductSubmit}
                    >
                      <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-xs font-extrabold text-[#0f2435]">
                            Product Name <span className="text-primary">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Enter product name"
                            defaultValue={editingProduct?.name ?? ""}
                            className="h-10 border-[#d6dee8] bg-white focus-visible:border-primary focus-visible:ring-primary/20"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="brand" className="text-xs font-extrabold text-[#0f2435]">
                            Brand <span className="text-primary">*</span>
                          </Label>
                          <select
                            id="brand"
                            name="brand"
                            defaultValue={editingProduct?.brand ?? ""}
                            className="h-10 w-full rounded-md border border-[#d6dee8] bg-white px-3 text-sm text-[#0f2435] shadow-xs outline-none transition focus:border-primary focus:ring-[3px] focus:ring-primary/20"
                            required
                          >
                            <option value="" disabled>
                              Select brand
                            </option>
                            {productBrands.map((brand) => (
                              <option key={brand.slug} value={brand.name}>
                                {brand.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid gap-5 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-xs font-extrabold text-[#0f2435]">
                            Category <span className="text-primary">*</span>
                          </Label>
                          <select
                            id="category"
                            name="category"
                            defaultValue={editingProduct?.category ?? productCategories[0]?.name}
                            className="h-10 w-full rounded-md border border-[#d6dee8] bg-white px-3 text-sm text-[#0f2435] shadow-xs outline-none transition focus:border-primary focus:ring-[3px] focus:ring-primary/20"
                            required
                          >
                            {productCategories.map((category) => (
                              <option key={category.name} value={category.name}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="site" className="text-xs font-extrabold text-[#0f2435]">
                            Website <span className="text-primary">*</span>
                          </Label>
                          <select
                            id="site"
                            name="site"
                            defaultValue={editingProduct?.site ?? siteConfigs.tracmac.slug}
                            className="h-10 w-full rounded-md border border-[#d6dee8] bg-white px-3 text-sm text-[#0f2435] shadow-xs outline-none transition focus:border-primary focus:ring-[3px] focus:ring-primary/20"
                            required
                          >
                            {catalogSites.map((site) => (
                              <option key={site.slug} value={site.slug}>
                                {site.shortName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="badge" className="text-xs font-extrabold text-[#0f2435]">Badge</Label>
                          <Input
                            id="badge"
                            name="badge"
                            placeholder="Optional: New, Best Seller, Popular"
                            defaultValue={editingProduct?.badge ?? ""}
                            className="h-10 border-[#d6dee8] bg-white focus-visible:border-primary focus-visible:ring-primary/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-xs font-extrabold text-[#0f2435]">
                          Description <span className="text-primary">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Enter a detailed product description..."
                          defaultValue={editingProduct?.description ?? ""}
                          className="min-h-24 border-[#d6dee8] bg-white focus-visible:border-primary focus-visible:ring-primary/20"
                          required
                        />
                      </div>

                      <div className="grid gap-5 md:grid-cols-1">
                        <div className="space-y-2">
                          <Label htmlFor="spec" className="text-xs font-extrabold text-[#0f2435]">Specifications</Label>
                          <Input
                            id="spec"
                            name="spec"
                            placeholder="Material, Size, Color, Capacity, etc."
                            defaultValue={editingProduct?.spec ?? ""}
                            className="h-10 border-[#d6dee8] bg-white focus-visible:border-primary focus-visible:ring-primary/20"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="image" className="text-xs font-extrabold text-[#0f2435]">
                          Product Image <span className="text-primary">*</span>
                        </Label>
                        {previewUrl && selectedImageFile ? (
                          <div className="rounded-lg border border-[#d6dee8] bg-white p-4">
                            <div className="relative h-72 overflow-hidden rounded-md bg-[#0f2435]">
                              <Cropper
                                image={previewUrl}
                                crop={imageCrop}
                                zoom={imageZoom}
                                aspect={1}
                                onCropChange={setImageCrop}
                                onZoomChange={setImageZoom}
                                onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
                                showGrid={false}
                              />
                            </div>
                            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                              <label className="flex min-w-0 flex-1 items-center gap-3 text-sm font-semibold text-[#0f2435]">
                                <span className="shrink-0">Zoom</span>
                                <input
                                  type="range"
                                  min="1"
                                  max="3"
                                  step="0.05"
                                  value={imageZoom}
                                  onChange={(event) => setImageZoom(Number(event.target.value))}
                                  className="w-full accent-orange-600"
                                />
                              </label>
                              <label
                                htmlFor="image"
                                className="inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-[#d6dee8] px-3 text-sm font-bold text-[#0f2435] transition hover:bg-orange-50 hover:text-primary"
                              >
                                Choose Different
                              </label>
                            </div>
                          </div>
                        ) : (
                          <label
                            htmlFor="image"
                            className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#b9c7d6] bg-[#eef3f7]/70 p-6 text-center transition hover:border-primary/50 hover:bg-orange-50"
                          >
                            {previewUrl ? (
                              <div className="relative">
                                <Image
                                  src={previewUrl}
                                  alt="Selected product preview"
                                  width={224}
                                  height={224}
                                  unoptimized
                                  className="max-h-56 rounded-md object-contain"
                                />
                                <span className="mt-3 block text-xs font-medium text-muted-foreground">
                                  Click to choose a different image
                                </span>
                              </div>
                            ) : (
                              <>
                                <ImagePlus className="h-10 w-10 text-[#6d7f91]" />
                                <span className="mt-3 text-sm font-extrabold text-[#0b2038]">Drag & drop images here</span>
                                <span className="mt-1 text-xs text-[#53677a]">
                                  or click to browse JPG, PNG, WEBP up to 5MB each
                                </span>
                              </>
                            )}
                          </label>
                        )}
                        <Input
                          key={imageInputKey}
                          id="image"
                          name="image"
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="sr-only"
                          onChange={(event) => {
                            const file = event.target.files?.[0]
                            setSelectedImageFile(file ?? null)
                            setPreviewUrl(file ? URL.createObjectURL(file) : "")
                            setCroppedAreaPixels(null)
                            setImageCrop({ x: 0, y: 0 })
                            setImageZoom(1)
                          }}
                        />
                        {previewUrl && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-fit"
                            onClick={() => {
                              setPreviewUrl("")
                              setSelectedImageFile(null)
                              setCroppedAreaPixels(null)
                              setImageCrop({ x: 0, y: 0 })
                              setImageZoom(1)
                              setImageInputKey((current) => current + 1)
                            }}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Clear preview
                          </Button>
                        )}
                      </div>

                      {message && (
                        <p
                          className={
                            message.includes("saved") ||
                            message.includes("updated") ||
                            message.includes("deleted") ||
                            message.includes("Welcome")
                              ? "text-sm text-primary"
                              : "text-sm text-destructive"
                          }
                        >
                          {message}
                        </p>
                      )}
                      <p className="flex items-center gap-2 text-xs text-[#53677a]">
                        <ImagePlus className="h-3.5 w-3.5" />
                        Upload one product image
                      </p>
                      <Button
                        className="h-11 bg-primary font-bold text-white shadow-lg shadow-orange-950/10 hover:bg-[#d95400]"
                        type="submit"
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden rounded-lg border border-[#d6dee8] bg-white shadow-lg shadow-slate-900/6">
                  <CardHeader className="flex flex-col gap-4 border-b border-[#e8eef4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-lg font-extrabold text-[#0b2038]">Existing Products</CardTitle>
                    <label className="relative block sm:w-48 lg:w-56">
                      <span className="sr-only">Search products</span>
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#53677a]" />
                      <Input
                        value={productSearchQuery}
                        onChange={(event) => setProductSearchQuery(event.target.value)}
                        placeholder="Search products..."
                        className="h-10 border-[#d6dee8] bg-white pl-9 text-sm focus-visible:border-primary focus-visible:ring-primary/20"
                      />
                    </label>
                  </CardHeader>
                  <CardContent className="p-0">
                    {visibleAdminProducts.length ? (
                      <div className="max-h-[690px] overflow-y-auto">
                        {visibleAdminProducts.map((product) => (
                          <div
                            key={product.id}
                            className="group grid gap-4 border-b border-[#e8eef4] p-4 transition last:border-b-0 hover:bg-[#fbfaf7] sm:grid-cols-[142px_minmax(0,1fr)_64px]"
                          >
                            <div className="flex h-32 items-center justify-center overflow-hidden rounded-md bg-[#eef3f7] p-3">
                              {product.imageUrl ? (
                                <Image
                                  src={product.imageUrl}
                                  alt={product.name}
                                  width={142}
                                  height={128}
                                  unoptimized
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <ImagePlus className="h-9 w-9 text-[#53677a]" />
                              )}
                            </div>

                            <div className="min-w-0 py-1">
                              <p className="truncate text-lg font-extrabold text-[#0b2038]">{product.name}</p>
                              <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.1em] text-primary">
                                {product.brand}
                              </p>
                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#33485f]">{product.description}</p>
                              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-[#53677a]">
                                <span className="rounded bg-orange-50 px-2 py-0.5 font-bold text-primary">
                                  {catalogSites.find((site) => site.slug === product.site)?.shortName ?? "TRACMAC"}
                                </span>
                                <span>{product.category}</span>
                                {product.badge && <span className="rounded bg-[#eef3f7] px-2 py-0.5">{product.badge}</span>}
                                {product.isDemo && <span>Demo item</span>}
                              </div>
                              <p className="mt-2 truncate text-xs font-semibold text-[#53677a]">Specs: {product.spec}</p>
                            </div>

                            <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
                              <BrandMark brand={product.brand} badge className="relative right-auto top-auto z-auto h-10 w-[58px]" />
                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-[#0b2038] hover:bg-orange-50 hover:text-primary"
                                  title="Edit product"
                                  disabled={product.isDemo}
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:bg-red-50 hover:text-destructive"
                                  title="Delete product"
                                  disabled={product.isDemo || deletingProductId === product.id}
                                  onClick={() => handleDeleteProduct(product)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="p-5 text-sm text-muted-foreground">No admin-added products match your search.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
                    ) : (
                      <div className="mt-6">
                        {activeAdminSection === "Dashboard" && (
                          <div className="grid gap-6">
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                              {[
                                { label: "Total Products", value: products.length, note: "Live catalog records", icon: PackagePlus },
                                { label: "Admin Added", value: adminProductCount, note: "Stored in MongoDB", icon: Boxes },
                                { label: "Tracmac", value: siteSummaries.find((site) => site.slug === "tracmac")?.count ?? 0, note: "Assigned products", icon: ShieldCheck },
                                { label: "Strongbuilt", value: siteSummaries.find((site) => site.slug === "strongbuilt")?.count ?? 0, note: "Assigned products", icon: HardDrive },
                                { label: "With Images", value: productsWithImages, note: "Product visuals available", icon: ImagePlus },
                                { label: "Categories", value: categorySummaries.filter((category) => category.count > 0).length, note: "Currently populated", icon: FolderOpen },
                              ].map((item) => (
                                <Card key={item.label} className="border-[#d6dee8] bg-white shadow-sm">
                                  <CardContent className="p-5">
                                    <div className="flex items-center justify-between">
                                      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-100 text-primary">
                                        <item.icon className="h-5 w-5" />
                                      </span>
                                      <span className="text-3xl font-extrabold text-[#061625]">{item.value}</span>
                                    </div>
                                    <p className="mt-4 text-sm font-extrabold text-[#0f2435]">{item.label}</p>
                                    <p className="mt-1 text-xs text-[#53677a]">{item.note}</p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                            <Card className="border-[#d6dee8] bg-white shadow-sm">
                              <CardHeader className="border-b border-[#e8eef4]">
                                <CardTitle className="text-lg text-[#0b2038]">Catalog Coverage</CardTitle>
                              </CardHeader>
                              <CardContent className="grid gap-3 p-5 md:grid-cols-2">
                                {categorySummaries.slice(0, 8).map((category) => (
                                  <div key={category.name} className="flex items-center justify-between rounded-md border border-[#e8eef4] px-4 py-3">
                                    <span className="text-sm font-semibold text-[#0f2435]">{category.name}</span>
                                    <Badge className="bg-orange-50 text-primary hover:bg-orange-50">{category.count}</Badge>
                                  </div>
                                ))}
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {activeAdminSection === "Categories" && (
                          <Card className="border-[#d6dee8] bg-white shadow-sm">
                            <CardHeader className="border-b border-[#e8eef4]">
                              <CardTitle className="text-lg text-[#0b2038]">Catalog Categories</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                              {categorySummaries.map((category) => (
                                <button
                                  key={category.name}
                                  type="button"
                                  onClick={() => setActiveAdminSection("Products")}
                                  className="rounded-lg border border-[#d6dee8] bg-white p-4 text-left transition hover:border-primary hover:bg-orange-50/40"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <h2 className="font-extrabold text-[#0f2435]">{category.name}</h2>
                                    <Badge className="bg-[#eef3f7] text-[#53677a] hover:bg-[#eef3f7]">{category.count}</Badge>
                                  </div>
                                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#53677a]">{category.description}</p>
                                </button>
                              ))}
                            </CardContent>
                          </Card>
                        )}

                        {activeAdminSection === "Brands" && (
                          <Card className="border-[#d6dee8] bg-white shadow-sm">
                            <CardHeader className="border-b border-[#e8eef4]">
                              <CardTitle className="text-lg text-[#0b2038]">Supported Brands</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                              {brandSummaries.map((brand) => (
                                <div key={brand.slug} className="flex items-center justify-between rounded-lg border border-[#d6dee8] bg-white p-4">
                                  <div>
                                    <BrandMark brand={brand.name} badge className="relative right-auto top-auto z-auto" />
                                    <p className="mt-3 text-sm font-extrabold text-[#0f2435]">{brand.name}</p>
                                  </div>
                                  <Badge className="bg-orange-50 text-primary hover:bg-orange-50">{brand.count}</Badge>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        )}

                        {activeAdminSection === "Orders / Quotes" && (
                          <Card className="border-[#d6dee8] bg-white shadow-sm">
                            <CardHeader className="flex flex-col gap-3 border-b border-[#e8eef4] sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <CardTitle className="text-lg text-[#0b2038]">Inquiry Inbox</CardTitle>
                                <p className="mt-1 text-sm text-[#53677a]">Latest contact and quote requests saved from the website.</p>
                              </div>
                              <Button type="button" variant="outline" onClick={loadInquiries} disabled={isLoadingInquiries}>
                                <RefreshCw className="h-4 w-4" />
                                {isLoadingInquiries ? "Refreshing..." : "Refresh"}
                              </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                              {isLoadingInquiries ? (
                                <p className="p-5 text-sm text-[#53677a]">Loading inquiries...</p>
                              ) : inquiries.length ? (
                                <div className="divide-y divide-[#e8eef4]">
                                  {inquiries.map((inquiry) => (
                                    <article key={inquiry.id} className="grid gap-4 p-5 lg:grid-cols-[240px_minmax(0,1fr)]">
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <Badge className="bg-orange-50 text-primary hover:bg-orange-50">New</Badge>
                                          <span className="text-xs font-semibold text-[#53677a]">
                                            {new Date(inquiry.createdAt).toLocaleString()}
                                          </span>
                                        </div>
                                        <h2 className="mt-3 text-lg font-extrabold text-[#0f2435]">{inquiry.name}</h2>
                                        {inquiry.company && <p className="mt-1 text-sm font-semibold text-[#53677a]">{inquiry.company}</p>}
                                        <div className="mt-3 space-y-1 text-sm text-[#33485f]">
                                          <a className="block font-medium hover:text-primary" href={`mailto:${inquiry.email}`}>
                                            {inquiry.email}
                                          </a>
                                          {inquiry.phone && (
                                            <a className="block font-medium hover:text-primary" href={`tel:${inquiry.phone}`}>
                                              {inquiry.phone}
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                      <div className="min-w-0">
                                        {inquiry.inquiryContext && (
                                          <p className="mb-3 rounded-md bg-[#eef3f7] px-3 py-2 text-sm font-bold text-[#0f2435]">
                                            {inquiry.inquiryContext}
                                          </p>
                                        )}
                                        <p className="whitespace-pre-wrap text-sm leading-6 text-[#33485f]">{inquiry.message}</p>
                                      </div>
                                    </article>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
                                  <ClipboardList className="h-12 w-12 text-primary" />
                                  <h2 className="mt-4 text-xl font-extrabold text-[#0f2435]">No inquiries yet</h2>
                                  <p className="mt-2 max-w-md text-sm leading-6 text-[#53677a]">
                                    Contact and quote requests submitted from the website will appear here.
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}

                        {activeAdminSection === "Users" && (
                          <Card className="border-[#d6dee8] bg-white shadow-sm">
                            <CardHeader className="border-b border-[#e8eef4]">
                              <CardTitle className="text-lg text-[#0b2038]">Admin Access</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                              <div className="flex flex-col gap-4 rounded-lg border border-[#d6dee8] p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f2435] text-white">
                                    <UserRound className="h-6 w-6" />
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-[#0f2435]">Admin</p>
                                    <p className="text-sm text-[#53677a]">Administrator session active</p>
                                  </div>
                                </div>
                                <Button type="button" variant="outline" onClick={handleLogout}>
                                  <LogOut className="h-4 w-4" />
                                  Logout
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {activeAdminSection === "Settings" && (
                          <Card className="border-[#d6dee8] bg-white shadow-sm">
                            <CardHeader className="border-b border-[#e8eef4]">
                              <CardTitle className="text-lg text-[#0b2038]">Catalog Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 p-5 md:grid-cols-2">
                              {[
                                ["Storage", "Products are saved in MongoDB and served to the public catalog API."],
                                ["Image Uploads", "JPG, PNG, WEBP, and GIF product images up to 5MB are supported. Hosted uploads are saved with the MongoDB product record."],
                                ["Session", "Admin sessions use the existing signed cookie authentication flow."],
                                ["Publishing", "Saved products are available immediately on the public Products page."],
                              ].map(([label, value]) => (
                                <div key={label} className="rounded-lg border border-[#d6dee8] bg-[#fbfaf7] p-4">
                                  <p className="font-extrabold text-[#0f2435]">{label}</p>
                                  <p className="mt-2 text-sm leading-6 text-[#53677a]">{value}</p>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                    <footer className="mt-8 border-t border-[#d6dee8] py-5 text-center text-sm text-[#53677a]">
                      &copy; {new Date().getFullYear()} TRACMAC Marketing. All rights reserved.
                    </footer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      {!isAuthenticated && <Footer />}
    </div>
  )
}
