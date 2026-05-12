import { randomUUID } from "crypto"
import { getMongoDb } from "@/lib/mongodb"
import { productCategories, type CatalogProduct, type ProductCategoryName } from "@/lib/product-data"

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])
const productsCollection = process.env.MONGODB_PRODUCTS_COLLECTION ?? "products"

type ProductDocument = CatalogProduct & {
  _id?: unknown
}

function collection() {
  return getMongoDb().then((db) => db.collection<ProductDocument>(productsCollection))
}

function toCatalogProduct(product: ProductDocument): CatalogProduct {
  const { _id, ...catalogProduct } = product

  return catalogProduct
}

async function readAdminProducts(): Promise<CatalogProduct[]> {
  const products = await (await collection())
    .find({})
    .sort({ createdAt: -1 })
    .toArray()

  return products.map(toCatalogProduct)
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
  const description = readTextValue(formData, "description")
  const spec = readTextValue(formData, "spec")
  const badge = readTextValue(formData, "badge")

  if (!name || !category || !description || !spec) {
    throw new Error("Name, category, description, and specs are required.")
  }

  if (!isValidCategory(category)) {
    throw new Error("Please choose a valid product category.")
  }

  return {
    name,
    category,
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

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Product images must be 5MB or smaller.")
  }

  const bytes = await file.arrayBuffer()

  return `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`
}

export async function getCatalogProducts() {
  return readAdminProducts()
}

export async function getAdminProducts() {
  return readAdminProducts()
}

export async function addAdminProduct(formData: FormData) {
  const payload = readProductPayload(formData)
  const image = formData.get("image")
  const product: CatalogProduct = {
    id: `admin-${randomUUID()}`,
    ...payload,
    imageUrl: image instanceof File ? await saveProductImage(image) : undefined,
    createdAt: new Date().toISOString(),
  }

  await (await collection()).insertOne(product)

  return product
}

export async function updateAdminProduct(id: string, formData: FormData) {
  if (!id) {
    throw new Error("Product ID is required.")
  }

  const payload = readProductPayload(formData)
  const image = formData.get("image")
  const products = await getAdminProducts()
  const existingProduct = products.find((product) => product.id === id)

  if (!existingProduct) {
    throw new Error("Product not found.")
  }

  const product: CatalogProduct = {
    ...existingProduct,
    ...payload,
    imageUrl: image instanceof File && image.size ? await saveProductImage(image) : existingProduct.imageUrl,
  }

  const result = await (await collection()).replaceOne({ id }, product)

  if (!result.matchedCount) {
    throw new Error("Product not found.")
  }

  return product
}

export async function deleteAdminProduct(id: string) {
  if (!id) {
    throw new Error("Product ID is required.")
  }

  const result = await (await collection()).deleteOne({ id })

  if (!result.deletedCount) {
    throw new Error("Product not found.")
  }
}
