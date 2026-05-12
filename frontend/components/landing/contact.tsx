"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

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
    details: ["Mon-Fri, 9am - 6pm PST"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@coretech.com.ph"],
  },
]

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic would go here
    console.log("Form submitted:", formData)
    alert("Thank you for your inquiry! We will get back to you within 24 hours.")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="contact" className="py-20 lg:py-28 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Contact Us</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Get in Touch
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Have questions about our products or need a custom quote? Our team is ready to help you find the right safety solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-6">
            {contactInfo.map((item) => (
              <Card key={item.title} className="border-border">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      {item.details.map((detail, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card className="border-border shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">Send Us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
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
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                        Company Name
                      </label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="ABC Construction Ltd."
                        value={formData.company}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
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
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+63 (917) 891-3681"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      placeholder="Tell us about your PPE requirements, quantities needed, or any questions you have..."
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    Submit Inquiry
                  </Button>

                  <p className="text-sm text-muted-foreground">
                    * Required fields. We typically respond within 24 business hours.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
