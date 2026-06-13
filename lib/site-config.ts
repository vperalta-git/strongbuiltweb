import type { StaticImageData } from "next/image"
import tmacLogo from "@/assets/tmaclogo.png"

export type SiteConfig = {
  name: string
  shortName: string
  slug: string
  basePath: string
  logo?: StaticImageData
  logoAlt: string
  contactLabel: string
  heroEyebrow: string
  heroTitlePrefix: string
  heroTitleAccent: string
  heroTitleSuffix: string
  heroDescription: string
  aboutEyebrow: string
  aboutTitle: string
  aboutDescription: string[]
  whyDescription: string
}

export const siteConfigs: Record<"tracmac" | "strongbuilt", SiteConfig> = {
  tracmac: {
    name: "TRACMAC Marketing",
    shortName: "TRACMAC",
    slug: "tracmac",
    basePath: "",
    logo: tmacLogo,
    logoAlt: "TRACMAC Marketing logo",
    contactLabel: "TRACMAC",
    heroEyebrow: "PPE Supply for Industrial Teams",
    heroTitlePrefix: "Industrial Safety",
    heroTitleAccent: "Equipment",
    heroTitleSuffix: "Built for Serious Worksites",
    heroDescription:
      "TRACMAC Marketing delivers premium personal protective equipment and safety solutions to construction, mining, and industrial sectors. Protect your workforce with certified safety gear from a supplier who understands your industry.",
    aboutEyebrow: "About TRACMAC",
    aboutTitle: "Protecting workforces across industries",
    aboutDescription: [
      "TRACMAC Marketing has been a leading supplier of personal protective equipment since 2010. We specialize in providing comprehensive safety solutions to the construction, mining, manufacturing, and industrial sectors.",
      "Our mission is to ensure every worker returns home safely. We partner with top manufacturers worldwide to bring you certified, quality PPE that meets the demanding requirements of your industry.",
    ],
    whyDescription:
      "TRACMAC Marketing combines product quality, industry expertise, and exceptional service to deliver safety solutions that protect your workforce.",
  },
  strongbuilt: {
    name: "Strongbuilt",
    shortName: "Strongbuilt",
    slug: "strongbuilt",
    basePath: "/strongbuilt",
    logoAlt: "Strongbuilt logo",
    contactLabel: "Strongbuilt",
    heroEyebrow: "Industrial Supply for Hardworking Teams",
    heroTitlePrefix: "Industrial Safety",
    heroTitleAccent: "Equipment",
    heroTitleSuffix: "Built for Serious Worksites",
    heroDescription:
      "Strongbuilt brings the same catalog-ready safety procurement experience to teams that need dependable PPE, industrial supplies, and fast access to product information.",
    aboutEyebrow: "About Strongbuilt",
    aboutTitle: "Supporting workforces across industries",
    aboutDescription: [
      "Strongbuilt helps teams quickly access product information, safety categories, and procurement support from one practical content-managed website.",
      "The experience mirrors the full Tracmac workflow, giving employees an easy way to update landing page content while visitors can browse products and send quote inquiries.",
    ],
    whyDescription:
      "Strongbuilt combines the same organized catalog experience, responsive inquiry flow, and industry-ready presentation used across the Tracmac website.",
  },
}

export function getSiteConfigForPath(pathname: string | null | undefined) {
  return pathname?.startsWith(siteConfigs.strongbuilt.basePath) ? siteConfigs.strongbuilt : siteConfigs.tracmac
}

export function siteHref(site: SiteConfig, href: string) {
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href
  }

  if (site.basePath && href === "/") {
    return site.basePath
  }

  return `${site.basePath}${href}`
}
