import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, Phone } from "lucide-react"
import tmacLogo from "@/assets/tmaclogo.png"

const footerLinks = {
  products: [
    { label: "Head Protection", href: "/products?category=Head%20Protection" },
    { label: "Workwear", href: "/products?category=Workwear" },
    { label: "Hand Protection", href: "/products?category=Hand%20Protection" },
    { label: "Foot Protection", href: "/products?category=Foot%20Protection" },
    { label: "Full Catalog", href: "/products" },
  ],
  industries: [
    { label: "Construction", href: "/#industries" },
    { label: "Mining", href: "/#industries" },
    { label: "Manufacturing", href: "/#industries" },
    { label: "Warehousing", href: "/#industries" },
  ],
  company: [
    { label: "About Us", href: "/#about" },
    { label: "Contact", href: "/#contact" },
    { label: "Request Quote", href: "/#contact" },
    { label: "Product Catalog", href: "/products" },
  ],
}

const contactLinks = [
  { icon: Phone, href: "tel:+639178913681", label: "Call TRACMAC" },
  { icon: Mail, href: "mailto:info@coretech.com.ph", label: "Email TRACMAC" },
  {
    icon: MapPin,
    href: "https://www.google.com/maps/search/?api=1&query=Mercedes+Plaza+I+Mercedes+Ave+Pasig+City",
    label: "Find TRACMAC",
  },
]

export function Footer() {
  return (
    <footer className="bg-[#243140] text-white">
      <div className="section-shell">
        <div className="grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="inline-flex px-0 py-0">
                <Image
                  src={tmacLogo}
                  alt="TRACMAC Marketing logo"
                  className="h-16 w-auto object-contain lg:h-18"
                />
              </div>
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/62">
              Industrial PPE, safety supplies, and procurement support for teams that need reliable protection.
            </p>
            <div className="mt-6 flex gap-3">
              {contactLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Products</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/62 transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Industries</h3>
            <ul className="space-y-3">
              {footerLinks.industries.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/62 transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/62 transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} TRACMAC Marketing. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/50">
            <Link href="/admin" className="transition-colors hover:text-white">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
