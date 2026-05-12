"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { ImagePlus, LogOut, PackagePlus, Pencil, ShieldCheck, Trash2, X } from "lucide-react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { productCategories, type CatalogProduct } from "@/lib/product-data"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingProductId, setDeletingProductId] = useState("")
  const [message, setMessage] = useState("")
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")

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

  useEffect(() => {
    loadAdminProducts().finally(() => setIsCheckingSession(false))
  }, [])

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
    setMessage("Welcome back! You can add products now.")
    await loadAdminProducts()
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    setIsAuthenticated(false)
    setProducts([])
    setEditingProduct(null)
    setMessage("")
  }

  function handleEditProduct(product: CatalogProduct) {
    setEditingProduct(product)
    setPreviewUrl(product.imageUrl ?? "")
    setMessage("")
  }

  function handleCancelEdit() {
    setEditingProduct(null)
    setPreviewUrl("")
    setMessage("")
  }

  async function handleProductSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setMessage("")

    const form = event.currentTarget
    const formData = new FormData(form)

    if (editingProduct) {
      formData.set("id", editingProduct.id)
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

    if (data.product) {
      setProducts((currentProducts) =>
        editingProduct
          ? currentProducts.map((product) => (product.id === data.product!.id ? data.product! : product))
          : [data.product!, ...currentProducts],
      )
    }

    form.reset()
    setEditingProduct(null)
    setPreviewUrl("")
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

    setProducts((currentProducts) => currentProducts.filter((item) => item.id !== product.id))

    if (editingProduct?.id === product.id) {
      setEditingProduct(null)
      setPreviewUrl("")
    }

    setMessage("Product deleted.")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-foreground py-14 text-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Badge className="bg-primary text-primary-foreground">Admin</Badge>
            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="max-w-3xl text-4xl font-bold leading-tight text-balance sm:text-5xl">
                  Manage the TRACMAC product catalog
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-background/75">
                  Add product names, images, descriptions, categories, and key specifications directly to the live catalog.
                </p>
              </div>
              <Button variant="secondary" asChild>
                <Link href="/products">View Catalog</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {isCheckingSession ? (
              <Card>
                <CardContent className="p-6 text-sm text-muted-foreground">Checking admin session...</CardContent>
              </Card>
            ) : !isAuthenticated ? (
              <Card className="mx-auto max-w-md">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Admin Login</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-5" onSubmit={handleLogin}>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" name="username" autoComplete="username" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" autoComplete="current-password" required />
                    </div>
                    {message && <p className="text-sm text-destructive">{message}</p>}
                    <Button className="w-full" type="submit">Login</Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15">
                        <PackagePlus className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{editingProduct ? "Edit Product" : "Add Product"}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      {editingProduct && (
                        <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form key={editingProduct?.id ?? "new-product"} className="grid gap-5" onSubmit={handleProductSubmit}>
                      <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Product Name</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Example: ImpactPro Safety Glasses"
                            defaultValue={editingProduct?.name ?? ""}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <select
                            id="category"
                            name="category"
                            defaultValue={editingProduct?.category ?? productCategories[0]?.name}
                            className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            required
                          >
                            {productCategories.map((category) => (
                              <option key={category.name} value={category.name}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Short customer-facing product description"
                          defaultValue={editingProduct?.description ?? ""}
                          required
                        />
                      </div>

                      <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="spec">Specs</Label>
                          <Input
                            id="spec"
                            name="spec"
                            placeholder="Example: ANSI Z87.1+, anti-fog lens"
                            defaultValue={editingProduct?.spec ?? ""}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="badge">Badge</Label>
                          <Input
                            id="badge"
                            name="badge"
                            placeholder="Optional: New, Best Seller, Popular"
                            defaultValue={editingProduct?.badge ?? ""}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="image">Product Image</Label>
                        <label
                          htmlFor="image"
                          className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center transition hover:border-primary/50 hover:bg-primary/5"
                        >
                          {previewUrl ? (
                            <img src={previewUrl} alt="Selected product preview" className="max-h-56 rounded-md object-contain" />
                          ) : (
                            <>
                              <ImagePlus className="h-10 w-10 text-muted-foreground" />
                              <span className="mt-3 text-sm font-medium text-foreground">
                                {editingProduct ? "Choose a new image" : "Choose an image"}
                              </span>
                              <span className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP, or GIF up to 5MB</span>
                            </>
                          )}
                        </label>
                        <Input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="sr-only"
                          onChange={(event) => {
                            const file = event.target.files?.[0]
                            setPreviewUrl(file ? URL.createObjectURL(file) : "")
                          }}
                        />
                      </div>

                      {message && (
                        <p className={message.includes("saved") || message.includes("updated") || message.includes("deleted") || message.includes("Welcome") ? "text-sm text-primary" : "text-sm text-destructive"}>
                          {message}
                        </p>
                      )}
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : editingProduct ? "Update Product" : "Publish Product"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Admin Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {products.length ? (
                      <div className="space-y-4">
                        {products.map((product) => (
                          <div key={product.id} className="flex gap-3 rounded-lg border border-border p-3">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                              ) : (
                                <PackagePlus className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
                              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-primary">{product.category}</p>
                              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                            </div>
                            <div className="ml-auto flex shrink-0 gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title="Edit product"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                title="Delete product"
                                disabled={deletingProductId === product.id}
                                onClick={() => handleDeleteProduct(product)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No admin-added products yet.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
