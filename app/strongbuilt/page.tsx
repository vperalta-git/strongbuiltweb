import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { ProductShowcase } from "@/components/landing/product-showcase"
import { Industries } from "@/components/landing/industries"
import { WhyChooseUs } from "@/components/landing/why-choose-us"
import { About } from "@/components/landing/about"
import { TrustedBrands } from "@/components/landing/trusted-brands"
import { CTABanner } from "@/components/landing/cta-banner"
import { Contact } from "@/components/landing/contact"
import { Footer } from "@/components/landing/footer"
import { siteConfigs } from "@/lib/site-config"

export default function StrongbuiltHomePage() {
  const site = siteConfigs.strongbuilt

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero site={site} />
        <TrustedBrands />
        <ProductShowcase site={site} />
        <Industries />
        <WhyChooseUs site={site} />
        <About site={site} />
        <CTABanner />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
