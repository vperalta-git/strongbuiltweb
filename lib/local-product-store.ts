import { productCategories, type CatalogProduct, type ProductCategoryName } from "@/lib/product-data"

const PRODUCTS_STORAGE_KEY = "tracmac.catalog.products.v1"
const MAX_IMAGE_BYTES = 750 * 1024
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

function readStoredProducts(): CatalogProduct[] {
  if (!canUseLocalStorage()) {
    return []
  }

  try {
    const raw = window.localStorage.getItem(PRODUCTS_STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as unknown

    return Array.isArray(parsed) ? (parsed as CatalogProduct[]) : []
  } catch {
    return []
  }
}

function writeStoredProducts(products: CatalogProduct[]) {
  if (!canUseLocalStorage()) {
    throw new Error("Browser storage is not available. Please enable it in your browser settings.")
  }

  try {
    window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
  } catch (error) {
    throw new Error(
      error instanceof DOMException && error.name === "QuotaExceededError"
        ? "Browser storage is full. Use a smaller image or delete older products first."
        : "Unable to save product in browser storage.",
    )
  }
}

function isValidCategory(category: string): category is ProductCategoryName {
  return productCategories.some((item) => item.name === category)
}

function readTextValue(formData: FormData, key: string) {
  const value = formData.get(key)

  return typeof value === "string" ? value.trim() : ""
}

function readProductPayload(formData: FormData) {
  const name = readTextValue(formData, "name")
  const category = readTextValue(formData, "category")
  const brand = readTextValue(formData, "brand")
  const description = readTextValue(formData, "description")
  const spec = readTextValue(formData, "spec")
  const badge = readTextValue(formData, "badge")

  if (!name || !category || !brand || !description || !spec) {
    throw new Error("Name, brand, category, description, and specs are required.")
  }

  if (!isValidCategory(category)) {
    throw new Error("Please choose a valid product category.")
  }

  return {
    name,
    category,
    brand,
    description,
    spec,
    badge: badge || undefined,
  }
}

async function saveProductImage(file: File) {
  if (!file.size) {
    return undefined
  }

  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Please upload a JPG, PNG, WEBP, or GIF image.")
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Product images must be 750KB or smaller for browser storage.")
  }

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
        return
      }

      reject(new Error("Unable to read the selected image."))
    }

    reader.onerror = () => reject(new Error("Unable to read the selected image."))
    reader.readAsDataURL(file)
  })
}

export function getLocalCatalogProducts() {
  return readStoredProducts()
}

export function addLocalProduct(formData: FormData) {
  const payload = readProductPayload(formData)
  const image = formData.get("image")
  const product: CatalogProduct = {
    id: globalThis.crypto?.randomUUID?.() ?? `admin-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ...payload,
    createdAt: new Date().toISOString(),
  }

  return Promise.resolve(image instanceof File ? saveProductImage(image) : undefined).then((imageUrl) => {
    const nextProduct = { ...product, imageUrl }
    const products = [nextProduct, ...readStoredProducts()]

    writeStoredProducts(products)

    return nextProduct
  })
}

export function updateLocalProduct(id: string, formData: FormData) {
  if (!id) {
    throw new Error("Product ID is required.")
  }

  const payload = readProductPayload(formData)
  const image = formData.get("image")
  const products = readStoredProducts()
  const existingProduct = products.find((product) => product.id === id)

  if (!existingProduct) {
    throw new Error("Product not found.")
  }

  return Promise.resolve(image instanceof File ? saveProductImage(image) : undefined).then((imageUrl) => {
    const product: CatalogProduct = {
      ...existingProduct,
      ...payload,
      imageUrl: imageUrl ?? existingProduct.imageUrl,
    }

    writeStoredProducts(products.map((item) => (item.id === id ? product : item)))

    return product
  })
}

export function deleteLocalProduct(id: string) {
  if (!id) {
    throw new Error("Product ID is required.")
  }

  const products = readStoredProducts()
  const nextProducts = products.filter((product) => product.id !== id)

  if (nextProducts.length === products.length) {
    throw new Error("Product not found.")
  }

  writeStoredProducts(nextProducts)
}
