"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { sendContactMessage } from "@/lib/email"
import {
  createQuoteMessage,
  QUOTE_CONTEXT_EVENT,
  QUOTE_CONTEXT_STORAGE_KEY,
  type QuoteContext,
} from "@/lib/quote-context"

const contactInfo = [
  {
    icon: MapPin,
    title: "Headquarters",
    details: [
      "4th Flr. Unit 405 Mercedes Plaza I, Mercedes Ave. cor. Luis St.,",
      "Brgy. San Miguel, Pasig City",
    ],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+63 (917) 891-3681"],
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Mon-Fri, 9am - 6pm PHT"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@coretech.com.ph"],
  },
]

export function Contact() {
  const [inquiryContext, setInquiryContext] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSending, setIsSending] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")

  function applyQuoteContext(context: QuoteContext) {
    const label =
      context.type === "product"
        ? `Product inquiry: ${context.value}`
        : context.type === "category"
          ? `Category inquiry: ${context.value}`
          : "General PPE inquiry"

    setInquiryContext(label)
    setFormData((current) => ({
      ...current,
      message: current.message || createQuoteMessage(context),
    }))
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const product = params.get("product")
    const category = params.get("category")
    const urlContext: QuoteContext | null = product
      ? { type: "product", value: product }
      : category
        ? { type: "category", value: category }
        : null

    if (urlContext) {
      applyQuoteContext(urlContext)
      return
    }

    try {
      const storedContext = window.localStorage.getItem(QUOTE_CONTEXT_STORAGE_KEY)

      if (storedContext) {
        applyQuoteContext(JSON.parse(storedContext) as QuoteContext)
      }
    } catch {
      window.localStorage.removeItem(QUOTE_CONTEXT_STORAGE_KEY)
    }

    function handleQuoteContext(event: Event) {
      const customEvent = event as CustomEvent<QuoteContext>

      applyQuoteContext(customEvent.detail)
    }

    window.addEventListener(QUOTE_CONTEXT_EVENT, handleQuoteContext)

    return () => window.removeEventListener(QUOTE_CONTEXT_EVENT, handleQuoteContext)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsSending(true)
    setStatusMessage("")

    try {
      const saveResponse = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          inquiryContext,
        }),
      })
      const saveResult = (await saveResponse.json()) as { message?: string }

      if (!saveResponse.ok) {
        throw new Error(saveResult.message ?? "Unable to save your inquiry right now.")
      }

      const result = await sendContactMessage(formData)
      const savedLocally = typeof result === "object" && result !== null && "local" in result

      setStatusMessage(
        savedLocally
          ? "Your inquiry was saved. Email notifications are not configured yet."
          : "Your message was sent successfully. We will get back to you within 24 hours.",
      )
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        message: "",
      })
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to send your message right now.")
    } finally {
      setIsSending(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-[#fbfaf7] py-16 lg:py-20">
      <div
        className="pointer-events-none absolute left-0 top-0 h-72 w-72 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle, #f97316 3px, transparent 3px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rotate-45 border-y-[36px] border-orange-100/55" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-56 w-56 rounded-full border-[6px] border-orange-100/70" />

      <div className="section-shell relative">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="text-sm font-extrabold uppercase tracking-[0.28em] text-primary">Contact Us</span>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-[#0b2038] sm:text-6xl">
            Get in touch
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-14 rounded-full bg-primary" />
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Have questions about our products or need a custom quote? Our team is ready to help you find the right
            safety solutions.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.65fr]">
          <div className="space-y-4">
            {contactInfo.map((item) => (
              <Card
                key={item.title}
                className="overflow-hidden border-slate-200 bg-white py-0 shadow-lg shadow-slate-900/8"
              >
                <CardContent className="border-l-2 border-primary p-5 sm:p-6">
                  <div className="flex items-center gap-5">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-orange-50 text-primary">
                      <item.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-[#0b2038]">{item.title}</h3>
                      {item.details.map((detail, index) => (
                        <p key={index} className="mt-1 text-sm leading-6 text-slate-600">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-slate-200 bg-white py-0 shadow-xl shadow-slate-900/10">
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <h3 className="text-2xl font-extrabold text-[#0b2038]">Send Us a Message</h3>
              <div className="mt-3 h-0.5 w-14 rounded-full bg-primary" />
              {inquiryContext && (
                <div className="mt-6 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-[#0b2038]">
                  {inquiryContext}
                </div>
              )}
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-bold text-[#0b2038]">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-11 border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="mb-2 block text-sm font-bold text-[#0b2038]">
                      Company Name
                    </label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="ABC Construction Ltd."
                      value={formData.company}
                      onChange={handleChange}
                      className="h-11 border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-bold text-[#0b2038]">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-11 border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-bold text-[#0b2038]">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+63 (917) 891-3681"
                      value={formData.phone}
                      onChange={handleChange}
                      className="h-11 border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-bold text-[#0b2038]">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Tell us about your PPE requirements, quantities needed, or any questions you have..."
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="border-slate-300 bg-white"
                  />
                </div>

                <Button type="submit" size="lg" className="h-12 px-8">
                  {isSending ? "Sending..." : "Submit Inquiry"}
                </Button>

                {statusMessage && (
                  <p className="text-sm text-slate-600" aria-live="polite">
                    {statusMessage}
                  </p>
                )}

                <p className="text-sm text-slate-500">
                  * Required fields. We typically respond within 24 business hours.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
