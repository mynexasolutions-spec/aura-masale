import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/storefront/ProductCard'
import Link from 'next/link'
import { Search } from 'lucide-react'

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
    `)
    .eq('is_active', true)

  if (categoryFilter) {
    // We need to filter by category slug. Since we are querying products, we can use referenced table filtering or filter post-fetch.
    // Supabase allows inner joins for filtering.
    query = query.eq('categories.slug', categoryFilter).not('categories', 'is', null)
  }

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`)
  }

  const { data: products, error } = await query

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
    <div className="bg-surface py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 bg-white rounded-3xl p-8 lg:p-12 border border-stone-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-50"></div>
          <h1 className="text-4xl font-bold text-stone-900 mb-4 relative z-10">
            {categoryFilter ? categories?.find(c => c.slug === categoryFilter)?.name : 'Shop All Spices'}
          </h1>
          <p className="text-stone-500 text-lg max-w-2xl relative z-10">
            Discover our complete collection of whole and ground spices, handpicked and freshly packed.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar / Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            {/* Search Box */}
            <form action="/shop" className="mb-8 relative">
              <input
                type="text"
                name="q"
                defaultValue={searchQuery || ''}
                placeholder="Search spices..."
                className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-4 pr-12 text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all placeholder:text-stone-400 shadow-sm"
              />
              {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-orange-600 transition-colors p-2">
                <Search className="h-5 w-5" />
              </button>
            </form>

            {/* Categories */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-stone-900 mb-4">Categories</h3>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    href={`/shop${searchQuery ? `?q=${searchQuery}` : ''}`}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      !categoryFilter ? 'bg-orange-50 text-orange-700' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    All Products
                  </Link>
                </li>
                {categories?.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/shop?category=${cat.slug}${searchQuery ? `&q=${searchQuery}` : ''}`}
                      className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        categoryFilter === cat.slug ? 'bg-orange-50 text-orange-700' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {formattedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
