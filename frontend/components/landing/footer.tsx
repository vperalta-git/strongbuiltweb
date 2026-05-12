import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import tmacLogo from "@/assets/tmaclogo.png"

const footerLinks = {
  products: [
    { label: "Head Protection", href: "/products" },
    { label: "Workwear", href: "/products" },
    { label: "Hand Protection", href: "/products" },
    { label: "Foot Protection", href: "/products" },
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
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-4">
              <Image
                src={tmacLogo}
                alt="TRACMAC Marketing logo"
                className="h-24 w-24 rounded-2xl bg-white p-2 object-contain shadow-lg ring-1 ring-primary/30 lg:h-30 lg:w-30"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-background lg:text-2xl">TRACMAC</span>
                <span className="text-xs uppercase tracking-[0.35em] text-background/60">Marketing</span>
              </div>
            </div>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-background mb-4">Products</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-background/70 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="font-semibold text-background mb-4">Industries</h3>
            <ul className="space-y-3">
              {footerLinks.industries.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-background/70 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-background mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-background/70 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-background/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">
            &copy; {new Date().getFullYear()} TRACMAC Marketing. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-background/50 hover:text-background/80 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-background/50 hover:text-background/80 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
