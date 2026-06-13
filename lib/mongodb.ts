import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB ?? "tracmac"

type MongoGlobal = typeof globalThis & {
  _tracmacMongoClientPromise?: Promise<MongoClient>
}

function getMongoClientPromise() {
  if (!uri) {
    throw new Error("MONGODB_URI is required. Add it to your environment variables.")
  }

  const globalWithMongo = globalThis as MongoGlobal

  if (!globalWithMongo._tracmacMongoClientPromise) {
    const client = new MongoClient(uri)
    globalWithMongo._tracmacMongoClientPromise = client.connect()
  }

  return globalWithMongo._tracmacMongoClientPromise
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClientPromise()

  return client.db(dbName)
}
