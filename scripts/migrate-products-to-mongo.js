const fs = require("node:fs")
const path = require("node:path")
const { MongoClient } = require("mongodb")

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), ".env.local")

  if (!fs.existsSync(envPath)) {
    return
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/)

  for (const line of lines) {
    const match = line.match(/^\s*([^#][^=]+)=(.*)$/)

    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2]
    }
  }
}

async function main() {
  loadLocalEnv()

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Add it to .env.local first.")
  }

  const productsPath = path.join(process.cwd(), "data", "products.json")
  const products = JSON.parse(fs.readFileSync(productsPath, "utf8"))

  if (!Array.isArray(products)) {
    throw new Error("data/products.json must contain an array.")
  }

  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()

    const db = client.db(process.env.MONGODB_DB || "tracmac")
    const collection = db.collection("products")

    await collection.createIndex({ id: 1 }, { unique: true })
    await collection.createIndex({ createdAt: -1 })

    let upserted = 0
    let modified = 0

    for (const product of products) {
      const result = await collection.updateOne({ id: product.id }, { $set: product }, { upsert: true })

      upserted += result.upsertedCount
      modified += result.modifiedCount
    }

    const totalProductsInMongo = await collection.countDocuments()

    console.log(
      JSON.stringify(
        {
          sourceProducts: products.length,
          upserted,
          modified,
          totalProductsInMongo,
        },
        null,
        2,
      ),
    )
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
