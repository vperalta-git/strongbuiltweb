import { MongoClient, ServerApiVersion, type MongoClientOptions } from "mongodb"

const dbName = process.env.MONGODB_DB ?? "tracmac"

const options: MongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

declare global {
  // eslint-disable-next-line no-var
  var __tracmacMongoClientPromise: Promise<MongoClient> | undefined
}

function getMongoClient() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error("MONGODB_URI is required. Add it to your environment variables.")
  }

  const clientPromise = global.__tracmacMongoClientPromise ?? new MongoClient(uri, options).connect()

  if (process.env.NODE_ENV !== "production") {
    global.__tracmacMongoClientPromise = clientPromise
  }

  return clientPromise
}

export async function getMongoDb() {
  const client = await getMongoClient()

  return client.db(dbName)
}
