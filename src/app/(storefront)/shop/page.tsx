import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/storefront/ProductCard'
import Link from 'next/link'
import { ShopSidebar } from './_components/ShopSidebar'

export const metadata = {
  title: 'Shop | Aura Masale',
  description: 'Browse our entire collection of authentic Indian spices.',
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const categoryFilter = typeof params.category === 'string' ? params.category : null
  const searchQuery = typeof params.q === 'string' ? params.q : null
  const pageStr = typeof params.page === 'string' ? params.page : '1'
  const page = parseInt(pageStr, 10) || 1
  const limit = 18
  const from = (page - 1) * limit
  const to = from + limit - 1

  const supabase = await createClient()

  // Fetch all active categories for the sidebar
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name')

  // Build the products query
  let query = supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      product_variants (
        price,
        is_active
      )
    `, { count: 'exact' })
    .eq('is_active', true)

  if (categoryFilter) {
    // We need to filter by category slug. Since we are querying products, we can use referenced table filtering or filter post-fetch.
    // Supabase allows inner joins for filtering.
    query = query.eq('categories.slug', categoryFilter).not('categories', 'is', null)
  }

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`)
  }

  query = query.range(from, to)

  const { data: products, error, count } = await query
  const totalPages = Math.ceil((count || 0) / limit)

  // Process products to find minimum variant price
  const formattedProducts = (products || []).map((product: any) => {
    const activeVariants = product.product_variants?.filter((v: any) => v.is_active) || []
    const prices = activeVariants.map((v: any) => v.price)
    const minPrice = prices.length > 0 ? Math.min(...prices) : null

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      shortDescription: product.short_description,
      featuredImage: product.featured_image_url,
      minPrice,
    }
  })

  return (
    <div className="bg-surface min-h-screen pb-12">
      
      {/* Header */}
      <div 
        className="relative overflow-hidden mb-12 bg-stone-900 bg-cover bg-center" 
        style={{ backgroundImage: "url('/shop-background.webp')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-sm">
            {categoryFilter ? categories?.find(c => c.slug === categoryFilter)?.name : 'Shop All Spices'}
          </h1>
          <p className="text-stone-200 text-lg max-w-2xl leading-relaxed drop-shadow-sm">
            Discover our complete collection of whole and ground spices, handpicked and freshly packed.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Sidebar / Filters */}
          <ShopSidebar categories={categories || []} categoryFilter={categoryFilter} searchQuery={searchQuery} />

          {/* Product Grid */}
          <div className="flex-1">
            {formattedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-lg font-medium text-text">No products found.</p>
                <p className="text-sm text-text-muted mt-1">Try adjusting your search or category filter.</p>
                {(searchQuery || categoryFilter) && (
                  <Link href="/shop" className="mt-4 inline-block text-primary hover:text-primary-dark font-medium">
                    Clear all filters
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {formattedProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    {page > 1 && (
                      <Link
                        href={`/shop?page=${page - 1}${categoryFilter ? `&category=${categoryFilter}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
                        className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors font-medium text-sm"
                      >
                        Previous
                      </Link>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={`/shop?page=${p}${categoryFilter ? `&category=${categoryFilter}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl border text-sm font-medium transition-colors ${
                          p === page 
                            ? 'bg-orange-600 border-orange-600 text-white shadow-sm shadow-orange-600/20' 
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {p}
                      </Link>
                    ))}
                    {page < totalPages && (
                      <Link
                        href={`/shop?page=${page + 1}${categoryFilter ? `&category=${categoryFilter}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
                        className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors font-medium text-sm"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
