import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"

export function CTABanner() {
  return (
    <section className="py-16 lg:py-20 bg-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-background text-balance">
            Ready to Equip Your Workforce?
          </h2>
          <p className="mt-4 text-lg text-background/70 max-w-2xl mx-auto text-pretty">
            Get in touch with our team today for a customized quote on PPE solutions tailored to your industry and requirements.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/#contact" className="flex items-center gap-2">
                Request a Quote Today
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-background/30 text-background hover:bg-background/10 hover:text-background" asChild>
              <Link href="tel:+1234567890" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Call Us Now
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-background/50">
            Quick response guaranteed within 24 hours
          </p>
        </div>
      </div>
    </section>
  )
}
