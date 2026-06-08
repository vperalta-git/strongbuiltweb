import { mkdir, readFile, unlink, writeFile } from "node:fs/promises"
import path from "node:path"
import { getBrandByName } from "@/lib/brand-data"
import { demoProducts, productCategories, type CatalogProduct, type ProductCategoryName } from "@/lib/product-data"

const DATA_DIR = path.join(process.cwd(), "data")
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json")
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products")
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
])

function isValidCategory(category: string): category is ProductCategoryName {
  return productCategories.some((item) => item.name === category)
}

function cleanText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : ""
}

function cleanBrand(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function isValidBrand(brand: string) {
  return Boolean(getBrandByName(brand))
}

function normalizeProduct(product: Partial<CatalogProduct>): CatalogProduct | null {
  const legacyProduct = product as Partial<CatalogProduct> & {
    image?: string
    images?: string[]
    specs?: string
  }
  const spec = product.spec ?? legacyProduct.specs
  const imageUrl = product.imageUrl ?? legacyProduct.image ?? legacyProduct.images?.[0]

  if (!product.id || !product.name || !product.category || !product.description || !spec) {
    return null
  }

  if (!isValidCategory(product.category)) {
    return null
  }

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    brand: getBrandByName(cleanBrand(product.brand ?? ""))?.name ?? "TRACMAC",
    description: product.description,
    spec,
    badge: product.badge || undefined,
    imageUrl: imageUrl || undefined,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    isDemo: product.isDemo,
  }
}

async function ensureDataFile() {
  await mkdir(DATA_DIR, { recursive: true })

  try {
    await readFile(PRODUCTS_FILE, "utf8")
  } catch {
    await writeFile(PRODUCTS_FILE, "[]", "utf8")
  }
}

export async function getProducts() {
  await ensureDataFile()

  try {
    const raw = await readFile(PRODUCTS_FILE, "utf8")
    const parsed = JSON.parse(raw) as unknown

    if (!Array.isArray(parsed)) {
      return []
    }

    const storedProducts = parsed
      .map((item) => normalizeProduct(item as Partial<CatalogProduct>))
      .filter((item): item is CatalogProduct => Boolean(item))
    const storedIds = new Set(storedProducts.map((product) => product.id))

    return [...storedProducts, ...demoProducts.filter((product) => !storedIds.has(product.id))]
  } catch {
    return demoProducts
  }
}

async function writeProducts(products: CatalogProduct[]) {
  await ensureDataFile()
  await writeFile(PRODUCTS_FILE, `${JSON.stringify(products, null, 2)}\n`, "utf8")
}

function readProductPayload(formData: FormData) {
  const name = cleanText(formData.get("name"))
  const category = cleanText(formData.get("category"))
  const brand = cleanBrand(cleanText(formData.get("brand")))
  const description = cleanText(formData.get("description"))
  const spec = cleanText(formData.get("spec")) || cleanText(formData.get("specs"))
  const badge = cleanText(formData.get("badge"))

  if (!name || !category || !brand || !description || !spec) {
    throw new Error("Name, brand, category, description, and specs are required.")
  }

  if (!isValidCategory(category)) {
    throw new Error("Please choose a valid product category.")
  }

  if (!isValidBrand(brand)) {
    throw new Error("Please choose a supported brand.")
  }

  return {
    name,
    category,
    brand: getBrandByName(brand)?.name ?? brand,
    description,
    spec,
    badge: badge || undefined,
  }
}

async function saveProductImage(file: File) {
  if (!file.size) {
    return undefined
  }

  const extension = allowedImageTypes.get(file.type)

  if (!extension) {
    throw new Error("Please upload a JPG, PNG, WEBP, or GIF image.")
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Product images must be 5MB or smaller.")
  }

  await mkdir(UPLOAD_DIR, { recursive: true })

  const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`
  const filepath = path.join(UPLOAD_DIR, filename)
  const buffer = Buffer.from(await file.arrayBuffer())

  await writeFile(filepath, buffer)

  return `/uploads/products/${filename}`
}

async function deleteUploadedImage(imageUrl?: string) {
  if (!imageUrl?.startsWith("/uploads/products/")) {
    return
  }

  try {
    await unlink(path.join(process.cwd(), "public", imageUrl))
  } catch {
    // Missing files should not block product updates or deletes.
  }
}

export async function addProduct(formData: FormData) {
  const payload = readProductPayload(formData)
  const image = formData.get("image")
  const imageUrl = image instanceof File ? await saveProductImage(image) : undefined
  const product: CatalogProduct = {
    id: crypto.randomUUID(),
    ...payload,
    imageUrl,
    createdAt: new Date().toISOString(),
  }
  const products = await getProducts()

  await writeProducts([product, ...products.filter((item) => !item.isDemo)])

  return product
}

export async function updateProduct(id: string, formData: FormData) {
  if (!id) {
    throw new Error("Product ID is required.")
  }

  if (id.startsWith("demo-")) {
    throw new Error("Demo products cannot be edited. Add a new product to replace it.")
  }

  const payload = readProductPayload(formData)
  const image = formData.get("image")
  const products = await getProducts()
  const existingProduct = products.find((product) => product.id === id)

  if (!existingProduct) {
    throw new Error("Product not found.")
  }

  const imageUrl = image instanceof File ? await saveProductImage(image) : undefined
  const product: CatalogProduct = {
    ...existingProduct,
    ...payload,
    imageUrl: imageUrl ?? existingProduct.imageUrl,
    updatedAt: new Date().toISOString(),
  }

  await writeProducts(products.filter((item) => !item.isDemo).map((item) => (item.id === id ? product : item)))

  if (imageUrl && imageUrl !== existingProduct.imageUrl) {
    await deleteUploadedImage(existingProduct.imageUrl)
  }

  return product
}

export async function deleteProduct(id: string) {
  if (!id) {
    throw new Error("Product ID is required.")
  }

  if (id.startsWith("demo-")) {
    throw new Error("Demo products cannot be deleted.")
  }

  const products = await getProducts()
  const productToDelete = products.find((product) => product.id === id)
  const nextProducts = products.filter((product) => product.id !== id)

  if (nextProducts.length === products.length) {
    throw new Error("Product not found.")
  }

  await writeProducts(nextProducts.filter((item) => !item.isDemo))
  await deleteUploadedImage(productToDelete?.imageUrl)
}
