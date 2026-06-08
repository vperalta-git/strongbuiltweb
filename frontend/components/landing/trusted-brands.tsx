import Image, { type StaticImageData } from "next/image"
import adelaLogo from "@/assets/logos/adelalogo.png"
import deltaPlusLogo from "@/assets/logos/deltapluslogo.png"
import safetyJoggerLogo from "@/assets/logos/safetyjoggerlogo.png"

type BrandLogo = {
  name: string
  logo: StaticImageData
}

const brandLogos: BrandLogo[] = [
  { name: "Adela", logo: adelaLogo },
  { name: "Delta Plus", logo: deltaPlusLogo },
  { name: "Safety Jogger", logo: safetyJoggerLogo },
]

const marqueeLogos = [...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos]

export function TrustedBrands() {
  return (
    <section className="trusted-brands-section">
      <div className="section-header">
        <p className="trusted-brands-eyebrow">Trusted PPE Brands We Supply</p>
        <div className="trusted-brands-accent" />
        <p className="trusted-brands-description">
          Partnered with reliable safety and industrial brands to provide certified PPE solutions for every worksite.
        </p>
      </div>

      <div className="caution-tape-separator" aria-hidden="true">
        <div className="caution-tape-track">
          {Array.from({ length: 10 }).map((_, index) => (
            <span key={index}>SAFETY FIRST</span>
          ))}
        </div>
      </div>

      <div className="logo-marquee">
        <div className="logo-track">
          {marqueeLogos.map((brand, index) => (
            <div key={`${brand.name}-${index}`} className="logo-card" aria-label={brand.name}>
              <Image src={brand.logo} alt={`${brand.name} logo`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
