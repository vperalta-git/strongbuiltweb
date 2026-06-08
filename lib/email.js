import emailjs from "@emailjs/browser"

const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
const LOCAL_INQUIRIES_KEY = "tracmac.local.inquiries"

function ensureEmailJsConfig() {
  if (!serviceId || !templateId || !publicKey) {
    throw new Error("Email service is not configured. Add the EmailJS environment variables first.")
  }
}

function saveLocalInquiry(contact) {
  if (typeof window === "undefined") {
    return
  }

  const raw = window.localStorage.getItem(LOCAL_INQUIRIES_KEY)
  const inquiries = raw ? JSON.parse(raw) : []

  window.localStorage.setItem(
    LOCAL_INQUIRIES_KEY,
    JSON.stringify([
      {
        ...contact,
        createdAt: new Date().toISOString(),
      },
      ...(Array.isArray(inquiries) ? inquiries : []),
    ]),
  )
}

/**
 * Send the contact form message through EmailJS.
 * @param {{ name: string, company: string, email: string, phone: string, message: string }} contact
 */
export async function sendContactMessage(contact) {
  try {
    ensureEmailJsConfig()
  } catch {
    saveLocalInquiry(contact)
    return { local: true }
  }

  return emailjs.send(serviceId, templateId, {
    from_name: contact.name,
    company: contact.company,
    reply_to: contact.email,
    phone: contact.phone,
    message: contact.message,
  }, { publicKey })
}
