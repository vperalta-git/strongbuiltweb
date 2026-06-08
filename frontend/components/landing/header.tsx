"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronDown, Menu, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import tmacLogo from "@/assets/tmaclogo.png"
import { cn } from "@/lib/utils"
import { QuoteLink } from "@/components/quote-link"

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/products", label: "Products", hasMenu: true },
  { href: "/#industries", label: "Industries", hasMenu: true },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeHash, setActiveHash] = useState("")

  useEffect(() => {
    const updateHash = () => setActiveHash(window.location.hash)

    updateHash()
    window.addEventListener("hashchange", updateHash)

    return () => window.removeEventListener("hashchange", updateHash)
  }, [])

  function isActiveLink(href: string) {
    const [linkPath, linkHash] = href.split("#")

    if (pathname === "/products") {
      return href === "/products"
    }

    if (pathname !== (linkPath || "/")) {
      return false
    }

    if (!linkHash) {
      return pathname === href
    }

    return activeHash ? activeHash === `#${linkHash}` : linkHash === "home"
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071d34]/95 text-white shadow-sm shadow-black/10 backdrop-blur-xl">
      <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between py-2">
          <Link href="/" className="flex items-center">
            <Image
              src={tmacLogo}
              alt="TRACMAC Marketing logo"
              className="h-16 w-auto object-contain lg:h-18"
              priority
            />
          </Link>

          <nav className="hidden h-20 items-center gap-10 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActiveLink(link.href) ? "page" : undefined}
                className={cn(
                  "relative flex h-full items-center gap-1.5 px-1 text-sm font-semibold text-white/72 transition-colors hover:text-white",
                  isActiveLink(link.href) &&
                    "text-white after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary",
                )}
              >
                {link.label}
                {link.hasMenu && <ChevronDown className="h-3.5 w-3.5" />}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <Button
              variant="outline"
              size="lg"
              className="h-11 border-white/35 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/products">
                <Search className="h-4 w-4" />
                Browse Products
              </Link>
            </Button>
            <Button size="lg" className="h-11 px-6 shadow-lg shadow-orange-950/30" asChild>
              <QuoteLink>Request a Quote</QuoteLink>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="rounded-md p-2 text-white transition hover:bg-white/10 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 py-4 lg:hidden">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActiveLink(link.href) ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white",
                    isActiveLink(link.href) && "bg-white/10 text-white",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-4">
                <Button variant="outline" size="sm" className="border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white" asChild>
                  <Link href="/products">
                    <Search className="h-4 w-4" />
                    Browse Products
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <QuoteLink onClick={() => setMobileMenuOpen(false)}>Request a Quote</QuoteLink>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
