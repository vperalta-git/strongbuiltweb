"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import tmacLogo from "@/assets/tmaclogo.png"

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/#industries", label: "Industries" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-28 items-center justify-between py-3 lg:min-h-32">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center gap-4">
              <Image
                src={tmacLogo}
                alt="TRACMAC Marketing logo"
                className="h-24 w-24 rounded-2xl bg-white p-2 object-contain shadow-lg ring-1 ring-primary/25 lg:h-30 lg:w-30"
                priority
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-foreground lg:text-2xl">TRACMAC</span>
                <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Marketing</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/#contact">Request a Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/#contact">Request a Quote</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
