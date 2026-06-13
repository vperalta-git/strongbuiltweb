"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { type ComponentProps, type MouseEvent, type ReactNode } from "react"
import { QUOTE_CONTEXT_EVENT, QUOTE_CONTEXT_STORAGE_KEY, type QuoteContext } from "@/lib/quote-context"
import { getSiteConfigForPath, siteHref } from "@/lib/site-config"

type QuoteLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  context?: QuoteContext
  children: ReactNode
}

export function QuoteLink({
  context = { type: "general", value: "PPE quote" },
  children,
  onClick,
  ...props
}: QuoteLinkProps) {
  const pathname = usePathname()
  const router = useRouter()
  const site = getSiteConfigForPath(pathname)
  const contactHref = siteHref(site, "/#contact")

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)

    if (event.defaultPrevented) {
      return
    }

    window.localStorage.setItem(QUOTE_CONTEXT_STORAGE_KEY, JSON.stringify(context))
    window.dispatchEvent(new CustomEvent(QUOTE_CONTEXT_EVENT, { detail: context }))

    if (pathname === (site.basePath || "/")) {
      event.preventDefault()
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })
      window.history.replaceState(null, "", "#contact")
      return
    }

    event.preventDefault()
    router.push(contactHref)
  }

  return (
    <Link href={contactHref} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
