import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-surface flex items-center justify-center py-20 lg:py-32 overflow-hidden">
        {/* Subtle background pattern/gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface to-[#fef3c7] opacity-50"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-light rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="relative max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-primary-dark text-xs font-semibold tracking-wide uppercase mb-6 shadow-sm border border-orange-200">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            Premium Indian Spices
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-text leading-tight mb-6 tracking-tight">
            Flavors that bring{' '}
            <span className="text-primary">
              Aura
            </span>{' '}
            to every meal
          </h1>
          <p className="text-lg sm:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover our handpicked collection of whole spices, ground spices,
            and artisanal spice blends — crafted for the modern Indian kitchen.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:bg-primary-light hover:-translate-y-0.5 transition-all duration-300"
            >
              Shop Collection
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-text font-semibold rounded-full border border-border shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories (Placeholder for now) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text mb-4">Shop by Category</h2>
            <p className="text-text-muted max-w-2xl mx-auto">Explore our range of authentic spices sourced directly from the best farms.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category 1 */}
            <Link href="/shop?category=whole-spices" className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h3 className="text-2xl font-bold text-white tracking-wider uppercase">Whole Spices</h3>
              </div>
            </Link>
            {/* Category 2 */}
            <Link href="/shop?category=ground-spices" className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h3 className="text-2xl font-bold text-white tracking-wider uppercase">Ground Spices</h3>
              </div>
            </Link>
            {/* Category 3 */}
            <Link href="/shop?category=blends" className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h3 className="text-2xl font-bold text-white tracking-wider uppercase">Spice Blends</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
