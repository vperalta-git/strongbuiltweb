import { mkdir, unlink, writeFile } from "node:fs/promises"
import path from "node:path"
import { getBrandByName } from "@/lib/brand-data"
import { getMongoDb } from "@/lib/mongodb"
import {
  demoProducts,
  productCategories,
  type CatalogProduct,
  type ProductCategoryName,
  type ProductSiteSlug,
} from "@/lib/product-data"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products")
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const PRODUCTS_COLLECTION = "products"
const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
])

type StoredProduct = Omit<CatalogProduct, "isDemo">

function isValidCategory(category: string): category is ProductCategoryName {
  return productCategories.some((item) => item.name === category)
}

function isValidSite(site: string): site is ProductSiteSlug {
  return site === "tracmac" || site === "strongbuilt"
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

function normalizeProduct(product: Partial<CatalogProduct> | null): CatalogProduct | null {
  if (!product) {
    return null
  }

  const legacyProduct = product as Partial<CatalogProduct> & {
    image?: string
    images?: string[]
    specs?: string
    siteSlug?: string
  }
  const spec = product.spec ?? legacyProduct.specs
  const imageUrl = product.imageUrl ?? legacyProduct.image ?? legacyProduct.images?.[0]
  const site = product.site ?? legacyProduct.siteSlug

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
    site: site && isValidSite(site) ? site : "tracmac",
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

async function productsCollection() {
  const db = await getMongoDb()
  const collection = db.collection<StoredProduct>(PRODUCTS_COLLECTION)

  await collection.createIndex({ id: 1 }, { unique: true })
  await collection.createIndex({ site: 1 })
  await collection.createIndex({ createdAt: -1 })

  return collection
}

export async function getProducts(options: { site?: ProductSiteSlug } = {}) {
  try {
    const collection = await productsCollection()
    const storedProducts = (await collection.find({}).sort({ createdAt: -1 }).toArray())
      .map((item) => normalizeProduct(item as Partial<CatalogProduct>))
      .filter((item): item is CatalogProduct => Boolean(item))
      .filter((product) => !options.site || product.site === options.site)
    const storedIds = new Set(storedProducts.map((product) => product.id))

    return [
      ...storedProducts,
      ...demoProducts.filter((product) => !storedIds.has(product.id) && (!options.site || product.site === options.site)),
    ]
  } catch (error) {
    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return demoProducts
    }

    throw error
  }
}

function readProductPayload(formData: FormData) {
  const name = cleanText(formData.get("name"))
  const category = cleanText(formData.get("category"))
  const site = cleanText(formData.get("site")) || "tracmac"
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

  if (!isValidSite(site)) {
    throw new Error("Please choose Tracmac or Strongbuilt for this product.")
  }

  if (!isValidBrand(brand)) {
    throw new Error("Please choose a supported brand.")
  }

  return {
    name,
    category,
    site,
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

  const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`
  const filepath = path.join(UPLOAD_DIR, filename)
  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    await mkdir(UPLOAD_DIR, { recursive: true })
    await writeFile(filepath, buffer)

    return `/uploads/products/${filename}`
  } catch {
    return `data:${file.type};base64,${buffer.toString("base64")}`
  }
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
  const collection = await productsCollection()

  await collection.insertOne(product)

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
  const collection = await productsCollection()
  const existingProduct = normalizeProduct((await collection.findOne({ id })) as Partial<CatalogProduct> | null)

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

  await collection.updateOne({ id }, { $set: product })

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

  const collection = await productsCollection()
  const productToDelete = normalizeProduct((await collection.findOne({ id })) as Partial<CatalogProduct> | null)

  if (!productToDelete) {
    throw new Error("Product not found.")
  }

  await collection.deleteOne({ id })
  await deleteUploadedImage(productToDelete.imageUrl)
}
