import { z } from "zod"
import { getMongoDb } from "@/lib/mongodb"

const CONTACT_INQUIRIES_COLLECTION = "contactInquiries"

export const contactInquirySchema = z.object({
  name: z.string().trim().min(1, "Full name is required.").max(120),
  company: z.string().trim().max(160).optional().default(""),
  email: z.string().trim().email("Please enter a valid email address.").max(180),
  phone: z.string().trim().max(60).optional().default(""),
  message: z.string().trim().min(1, "Message is required.").max(4000),
  inquiryContext: z.string().trim().max(240).optional().default(""),
})

export type ContactInquiryInput = z.input<typeof contactInquirySchema>

export type ContactInquiry = z.output<typeof contactInquirySchema> & {
  id: string
  status: "new"
  createdAt: string
}

async function contactInquiriesCollection() {
  const db = await getMongoDb()
  const collection = db.collection<ContactInquiry>(CONTACT_INQUIRIES_COLLECTION)

  await collection.createIndex({ id: 1 }, { unique: true })
  await collection.createIndex({ createdAt: -1 })
  await collection.createIndex({ status: 1, createdAt: -1 })

  return collection
}

export async function addContactInquiry(input: ContactInquiryInput) {
  const payload = contactInquirySchema.parse(input)
  const inquiry: ContactInquiry = {
    id: crypto.randomUUID(),
    ...payload,
    status: "new",
    createdAt: new Date().toISOString(),
  }
  const collection = await contactInquiriesCollection()

  await collection.insertOne(inquiry)

  return inquiry
}

export async function getContactInquiries() {
  const collection = await contactInquiriesCollection()

  return collection.find({}).sort({ createdAt: -1 }).limit(100).toArray()
}
