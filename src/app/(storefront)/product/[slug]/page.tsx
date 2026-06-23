import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ProductImageGallery } from '@/components/storefront/ProductImageGallery'
import { ProductVariantSelector } from '@/components/storefront/ProductVariantSelector'
import { ProductAccordion } from '@/components/storefront/ProductAccordion'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('seo_title, seo_description, name, short_description')
    .eq('slug', slug)
    .single()

  if (!product) return { title: 'Product Not Found' }

  return {
    title: product.seo_title || `${product.name} | Aura Masale`,
    description: product.seo_description || product.short_description || `Buy authentic ${product.name} from Aura Masale.`,
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch product and all related data
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (id, name, slug),
      product_images (*),
      product_variants (*),
      product_information (*),
      product_faqs (*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !product) {
    notFound()
  }

  // Sort relations
  const sortedInfo = (product.product_information || []).sort((a: any, b: any) => a.display_order - b.display_order)
  const sortedFaqs = (product.product_faqs || []).sort((a: any, b: any) => a.display_order - b.display_order)

  return (
    <div className="bg-surface py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm font-medium text-text-muted mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          {product.categories && (
            <>
              <Link href={`/shop?category=${product.categories.slug}`} className="hover:text-primary transition-colors">
                {product.categories.name}
              </Link>
              <ChevronRight className="w-4 h-4 mx-2" />
            </>
          )}
          <span className="text-text">{product.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          
          {/* Left Column: Image Gallery */}
          <div className="mb-10 lg:mb-0">
            <ProductImageGallery 
              images={product.product_images || []} 
              featuredImage={product.featured_image_url} 
            />
          </div>

          {/* Right Column: Product Info & Actions */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              {product.name}
            </h1>
            
            {product.short_description && (
              <p className="text-lg text-text-muted mb-6">
                {product.short_description}
              </p>
            )}

            {/* Variants Selector (Handles Price & Add to Cart) */}
            <ProductVariantSelector variants={product.product_variants || []} />

            {/* Description section (always visible) */}
            {product.description && (
              <div className="mt-12">
                <h3 className="text-lg font-bold text-text mb-4">Description</h3>
                <div className="prose prose-sm text-text-muted max-w-none whitespace-pre-wrap">
                  {product.description}
                </div>
              </div>
            )}

            {/* Accordions for additional info and FAQs */}
            <ProductAccordion info={sortedInfo} faqs={sortedFaqs} />

          </div>
        </div>

      </div>
    </div>
  )
}
