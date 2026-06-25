import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { HeroSlider } from '@/components/storefront/HeroSlider'
import { Testimonials } from '@/components/storefront/Testimonials'
import { FeaturedProducts } from '@/components/storefront/FeaturedProducts'
import { Leaf, ShieldCheck, Truck, Clock } from 'lucide-react'

export const metadata = {
  title: 'Home | Aura Masale',
  description: 'Aura Masale provides premium, authentic Indian spices sourced directly from farms.',
}

export default async function HomePage() {
  const supabase = await createClient()
  
  // Fetch active hero slides
  const { data: slides } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })

  // Fetch active categories
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  // Fetch featured products
  const { data: featuredProductsData } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8)

  const activeSlides = slides || []
  const categories = categoriesData || []
  const featuredProducts = featuredProductsData || []

  // Extract global text and text mode
  const currentMode = activeSlides.length > 0 ? (activeSlides[0].text_mode || 'global') : 'global'
  const globalText = activeSlides.length > 0 ? {
    title: activeSlides[0].title || '',
    subtitle: activeSlides[0].subtitle || '',
    button_text: activeSlides[0].button_text || '',
    button_link: activeSlides[0].button_link || '',
    text_mode: currentMode
  } : {
    title: 'Flavors that bring Aura to every meal',
    subtitle: 'Discover our handpicked collection of whole spices, ground spices, and artisanal spice blends — crafted for the modern Indian kitchen.',
    button_text: 'Shop Collection',
    button_link: '/shop',
    text_mode: 'global'
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      {activeSlides.length > 0 ? (
        <HeroSlider 
          slides={activeSlides} 
          globalText={globalText} 
          textMode={currentMode as 'global' | 'per_slide'} 
        />
      ) : (
        <section className="relative bg-surface flex items-center justify-center py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-surface to-[#fef3c7] opacity-50"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-light rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          
          <div className="relative max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8 z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-text leading-tight mb-6 tracking-tight">
              Flavors that bring <span className="text-primary">Aura</span> to every meal
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
            </div>
          </div>
        </section>
      )}

      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text mb-4">Shop by Category</h2>
            <p className="text-text-muted max-w-2xl mx-auto">Explore our range of authentic spices sourced directly from the best farms.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.length > 0 ? categories.map((category) => (
              <Link key={category.id} href={`/shop?category=${category.slug}`} className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 flex items-center justify-center border border-stone-200">
                {category.image_url ? (
                  <>
                    <Image 
                      src={category.image_url} 
                      alt={category.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 z-10" />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <h3 className="text-2xl font-bold text-white tracking-wider uppercase drop-shadow-md">{category.name}</h3>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200 group-hover:from-stone-200 group-hover:to-stone-300 transition-colors duration-300 z-10" />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <h3 className="text-2xl font-bold text-stone-800 tracking-wider uppercase">{category.name}</h3>
                    </div>
                  </>
                )}
              </Link>
            )) : (
              <p className="text-stone-500 col-span-full text-center">No categories found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <FeaturedProducts products={featuredProducts as any} />
      )}

      {/* Why Choose Us */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">The Aura Promise</h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-lg">We believe that great food starts with great ingredients. That's why we never compromise on quality.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">100% Pure</h3>
              <p className="text-stone-600">No artificial colors, preservatives, or fillers. Just pure, unadulterated spices.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Ethically Sourced</h3>
              <p className="text-stone-600">We partner directly with farmers to ensure fair trade and the highest quality harvest.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Freshly Ground</h3>
              <p className="text-stone-600">Our spices are ground in small batches to lock in their essential oils and aroma.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Fast Delivery</h3>
              <p className="text-stone-600">Securely packaged and delivered quickly right to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story / Philosophy */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-900 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
            <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-20 lg:py-24 lg:px-16 flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">Authentic heritage in every pinch.</h2>
                <p className="text-stone-300 text-lg mb-8 leading-relaxed">
                  Aura Masale was born out of a passion for traditional Indian cooking. We noticed that modern kitchens were losing the authentic aromas that defined our childhoods. Our mission is to bring back those authentic, rich flavors of traditional Indian spices.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 text-stone-950 font-semibold rounded-full hover:bg-orange-400 transition-all duration-300"
                >
                  Read Our Story
                </Link>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <div className="relative w-72 h-72 rounded-full overflow-hidden border-8 border-stone-800 shadow-2xl">
                  <Image 
                    src="/logo.webp" 
                    alt="Aura Masale" 
                    fill 
                    className="object-contain bg-white p-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </div>
  )
}
