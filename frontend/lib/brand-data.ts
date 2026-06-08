export type Brand = {
  name: string
  slug: string
  initials: string
  logoSrc?: string
}

export const productBrands: Brand[] = [
  { name: "TRACMAC", slug: "tracmac", initials: "TM" },
  { name: "Adela", slug: "adela", initials: "AD" },
  { name: "Safety Jogger", slug: "safety-jogger", initials: "SJ" },
  { name: "3M", slug: "3m", initials: "3M" },
  { name: "Honeywell", slug: "honeywell", initials: "HW" },
  { name: "Delta Plus", slug: "delta-plus", initials: "DP" },
  { name: "Uvex", slug: "uvex", initials: "UX" },
  { name: "Ansell", slug: "ansell", initials: "AN" },
  { name: "MSA Safety", slug: "msa-safety", initials: "MSA" },
  { name: "Portwest", slug: "portwest", initials: "PW" },
]

export function getBrandByName(name: string) {
  const normalizedName = name.trim().toLowerCase()

  return productBrands.find((brand) => brand.name.toLowerCase() === normalizedName)
}

export function getBrandMark(name: string) {
  return getBrandByName(name) ?? {
    name: name || "Unbranded",
    slug: "custom",
    initials: (name || "UB")
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 3)
      .toUpperCase(),
  }
}
