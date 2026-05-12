import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, HardHat, Factory } from "lucide-react"

export function Hero() {
  return (
    <section id="home" className="relative bg-foreground overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-background leading-tight text-balance">
              Industrial Safety Equipment You Can{" "}
              <span className="text-primary">Trust</span>
            </h1>
            <p className="mt-6 text-lg text-background/70 max-w-xl mx-auto lg:mx-0 text-pretty">
              TRACMAC Marketing delivers premium personal protective equipment to construction, mining, and industrial sectors. Protect your workforce with certified safety gear from a supplier who understands your industry.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" asChild>
                <Link href="/products">View Products</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-background/30 text-background hover:bg-background/10 hover:text-background" asChild>
                <Link href="/#contact">Get a Quote</Link>
              </Button>
            </div>

          </div>

          {/* Hero Visual */}
          <div className="relative hidden lg:block">
            <div className="relative bg-background/5 rounded-2xl p-8 backdrop-blur-sm border border-background/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/10 rounded-xl p-6 flex flex-col items-center text-center">
                  <HardHat className="h-12 w-12 text-primary mb-3" />
                  <span className="text-background font-medium">Head Protection</span>
                </div>
                <div className="bg-background/10 rounded-xl p-6 flex flex-col items-center text-center">
                  <ShieldCheck className="h-12 w-12 text-primary mb-3" />
                  <span className="text-background font-medium">Body Protection</span>
                </div>
                <div className="bg-background/10 rounded-xl p-6 flex flex-col items-center text-center col-span-2">
                  <Factory className="h-12 w-12 text-primary mb-3" />
                  <span className="text-background font-medium">Complete Industrial Safety Solutions</span>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 h-20 w-20 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 h-16 w-16 bg-primary/30 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 33.3C840 36.7 960 43.3 1080 45C1200 46.7 1320 43.3 1380 41.7L1440 40V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="oklch(0.985 0 0)"/>
        </svg>
      </div>
    </section>
  )
}
