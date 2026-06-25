import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ProductImageGallery } from '@/components/storefront/ProductImageGallery'
import { ProductVariantSelector } from '@/components/storefront/ProductVariantSelector'
import { ProductAccordion } from '@/components/storefront/ProductAccordion'
import { ProductReviews } from '@/components/storefront/ProductReviews'

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

  // Check authentication status
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthenticated = !!user

  // Fetch approved reviews
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('id, rating, review_text, created_at, user:profiles(full_name)')
    .eq('product_id', product.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  const reviews = reviewsData || []

  // Sort relations
  const sortedInfo = (product.product_information || []).sort((a: any, b: any) => a.display_order - b.display_order)
  let sortedFaqs = (product.product_faqs || []).sort((a: any, b: any) => a.display_order - b.display_order)

  if (product.use_global_faqs) {
    const { data: globalFaqs } = await supabase.from('global_faqs').select('*').order('display_order')
    if (globalFaqs) {
      sortedFaqs = globalFaqs
    }
  }

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

            {/* FAQs Accordion removed from here */}
          </div>
        </div>

        {/* Description & Additional Info Section */}
        {(product.description || sortedInfo.length > 0) && (
          <div className="mt-20 border-t border-border pt-16">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-16">
              
              {/* Description */}
              <div className="mb-12 lg:mb-0">
                <h3 className="text-2xl font-bold text-text mb-6">Description</h3>
                {product.description ? (
                  <div className="prose prose-sm text-text-muted max-w-none whitespace-pre-wrap">
                    {product.description}
                  </div>
                ) : (
                  <p className="text-text-muted italic">No description available.</p>
                )}
              </div>

              {/* Additional Information Table */}
              <div>
                <h3 className="text-2xl font-bold text-text mb-6">Additional Information</h3>
                {sortedInfo.length > 0 ? (
                  <div className="overflow-hidden bg-white border border-border rounded-xl">
                    <table className="min-w-full divide-y divide-border">
                      <tbody className="divide-y divide-border">
                        {sortedInfo.map((info: any, idx: number) => (
                          <tr key={info.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-text sm:pl-6 w-1/3 border-r border-border">
                              {info.label}
                            </td>
                            <td className="px-4 py-4 text-sm text-text-muted sm:pr-6 whitespace-pre-wrap">
                              {info.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-text-muted italic">No additional information available.</p>
                )}
              </div>

            </div>
          </div>
        )}

        {/* FAQs & Future Reviews Section */}
        {(sortedFaqs.length > 0 || true) && (
          <div className="mt-20 border-t border-border pt-16">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-16">
              
              {/* FAQs */}
              <div className="mb-12 lg:mb-0">
                {sortedFaqs.length > 0 ? (
                  <>
                    <h3 className="text-2xl font-bold text-text mb-6">Frequently Asked Questions</h3>
                    <ProductAccordion faqs={sortedFaqs} />
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-text-muted">
                    {/* No FAQs */}
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div>
                <ProductReviews 
                  productId={product.id} 
                  isAuthenticated={isAuthenticated} 
                  reviews={reviews as any} 
                />
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}
