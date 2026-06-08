import Image, { type StaticImageData } from "next/image"
import { getBrandMark } from "@/lib/brand-data"
import { cn } from "@/lib/utils"
import adelaLogo from "@/assets/logos/adelalogo.png"
import deltaPlusLogo from "@/assets/logos/deltapluslogo.png"
import safetyJoggerLogo from "@/assets/logos/safetyjoggerlogo.png"

type BrandMarkProps = {
  brand: string
  className?: string
  badge?: boolean
  compact?: boolean
}

const brandLogoMap: Record<string, StaticImageData> = {
  adela: adelaLogo,
  "delta plus": deltaPlusLogo,
  "safety jogger": safetyJoggerLogo,
}

export function BrandMark({ brand, className, badge = false, compact = false }: BrandMarkProps) {
  const brandMark = getBrandMark(brand)
  const logo = brandLogoMap[brandMark.name.toLowerCase()]
  const logoClassName = badge
    ? "block h-full w-full object-contain"
    : cn("h-auto w-auto object-contain", compact ? "max-h-7 max-w-20" : "max-h-8 max-w-24")

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center border text-foreground",
        badge
          ? "h-[38px] w-16 min-w-0 rounded-[10px] border-[#D6DEE8] bg-white px-2 py-1.5 text-[10px] leading-none shadow-[0_6px_16px_rgba(15,36,53,0.10)]"
          : cn(
              "rounded-md border-border bg-background/95 shadow-sm",
              compact ? "h-10 min-w-24 px-3 text-[10px]" : "h-12 min-w-28 px-4 text-xs",
            ),
        className,
      )}
      title={brandMark.name}
    >
      {logo ? (
        <Image
          src={logo}
          alt={`${brandMark.name} logo`}
          className={logoClassName}
        />
      ) : brandMark.logoSrc ? (
        <img
          src={brandMark.logoSrc}
          alt={`${brandMark.name} logo`}
          className={logoClassName}
        />
      ) : (
        <span className={cn("font-bold tracking-wide", badge && "text-[#53677a]")}>{brandMark.initials || "Brand"}</span>
      )}
    </div>
  )
}
