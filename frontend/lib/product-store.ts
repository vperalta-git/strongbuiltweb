import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { randomUUID } from "crypto"
import { getFirebaseBucket, getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase-admin"
import { productCategories, type CatalogProduct, type ProductCategoryName } from "@/lib/product-data"

const isServerlessRuntime = Boolean(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_LAMBDA_FUNCTION_NAME)
const fallbackStorageRoot = isServerlessRuntime ? path.join(tmpdir(), "tracmac") : process.cwd()
const dataDir = process.env.PRODUCT_DATA_DIR ?? path.join(fallbackStorageRoot, "data")
const productsFile = path.join(dataDir, "products.json")
const uploadDir = path.join(process.cwd(), "public", "uploads", "products")
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])
const productsCollection = "adminProducts"

async function ensureDataStorage() {
  await fs.mkdir(dataDir, { recursive: true })
}

async function ensureUploadStorage() {
  await fs.mkdir(uploadDir, { recursive: true })
}

async function readAdminProducts(): Promise<CatalogProduct[]> {
  try {
    const rawProducts = await fs.readFile(productsFile, "utf8")
    const products = JSON.parse(rawProducts)

    return Array.isArray(products) ? products : []
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return []
    }

    throw error
  }
}

async function writeAdminProducts(products: CatalogProduct[]) {
  await ensureDataStorage()
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2))
}

async function readFirebaseProducts(): Promise<CatalogProduct[]> {
  const db = await getFirebaseDb()
  const snapshot = await db.collection(productsCollection).get()

  return snapshot.docs
    .map((doc) => doc.data() as CatalogProduct)
    .sort((first, second) => (second.createdAt ?? "").localeCompare(first.createdAt ?? ""))
}

async function writeFirebaseProduct(product: CatalogProduct) {
  const db = await getFirebaseDb()

  await db.collection(productsCollection).doc(product.id).set(product)
}

async function deleteFirebaseProduct(id: string) {
  const db = await getFirebaseDb()

  await db.collection(productsCollection).doc(id).delete()
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

  if (isServerlessRuntime) {
    return `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`
  }

  await ensureUploadStorage()

  const extension = file.name.split(".").pop()?.toLowerCase() || file.type.split("/").pop() || "jpg"
  const filename = `${Date.now()}-${randomUUID()}.${extension}`

  await fs.writeFile(path.join(uploadDir, filename), Buffer.from(bytes))

  return `/uploads/products/${filename}`
}

async function saveProductImageToFirebase(file: File) {
  if (!file.size) {
    return undefined
  }

  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Please upload a JPG, PNG, WEBP, or GIF image.")
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Product images must be 5MB or smaller.")
  }

  const bucket = await getFirebaseBucket()

  if (!bucket) {
    return saveProductImage(file)
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || file.type.split("/").pop() || "jpg"
  const filename = `products/${Date.now()}-${randomUUID()}.${extension}`
  const upload = bucket.file(filename)
  const bytes = Buffer.from(await file.arrayBuffer())

  await upload.save(bytes, {
    contentType: file.type,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  })

  const [url] = await upload.getSignedUrl({
    action: "read",
    expires: "01-01-2500",
  })

  return url
}

export async function getCatalogProducts() {
  return isFirebaseConfigured() ? readFirebaseProducts() : readAdminProducts()
}

export async function getAdminProducts() {
  return isFirebaseConfigured() ? readFirebaseProducts() : readAdminProducts()
}

export async function addAdminProduct(formData: FormData) {
  const payload = readProductPayload(formData)
  const image = formData.get("image")

  const imageUrl = image instanceof File
    ? isFirebaseConfigured()
      ? await saveProductImageToFirebase(image)
      : await saveProductImage(image)
    : undefined
  const product: CatalogProduct = {
    id: `admin-${randomUUID()}`,
    ...payload,
    imageUrl,
    createdAt: new Date().toISOString(),
  }

  if (isFirebaseConfigured()) {
    await writeFirebaseProduct(product)
  } else {
    const products = await readAdminProducts()

    await writeAdminProducts([product, ...products])
  }

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

  const imageUrl =
    image instanceof File && image.size
      ? isFirebaseConfigured()
        ? await saveProductImageToFirebase(image)
        : await saveProductImage(image)
      : existingProduct.imageUrl

  const product: CatalogProduct = {
    ...existingProduct,
    ...payload,
    imageUrl,
  }

  if (isFirebaseConfigured()) {
    await writeFirebaseProduct(product)
  } else {
    await writeAdminProducts(products.map((item) => (item.id === id ? product : item)))
  }

  return product
}

export async function deleteAdminProduct(id: string) {
  if (!id) {
    throw new Error("Product ID is required.")
  }

  const products = await getAdminProducts()

  if (!products.some((product) => product.id === id)) {
    throw new Error("Product not found.")
  }

  if (isFirebaseConfigured()) {
    await deleteFirebaseProduct(id)
  } else {
    await writeAdminProducts(products.filter((product) => product.id !== id))
  }
}
