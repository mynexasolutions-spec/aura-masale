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
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-text mb-4">Shop All Spices</h1>
          <p className="text-text-muted">Discover our complete collection of whole and ground spices.</p>
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
                className="w-full rounded-md border-0 py-2.5 pl-4 pr-10 text-text shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
              />
              {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
              <button type="submit" className="absolute right-2 top-2.5 text-gray-400 hover:text-primary">
                <Search className="h-5 w-5" />
              </button>
            </form>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-bold text-text mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/shop${searchQuery ? `?q=${searchQuery}` : ''}`}
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      !categoryFilter ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-gray-100 hover:text-text'
                    }`}
                  >
                    All Products
                  </Link>
                </li>
                {categories?.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/shop?category=${cat.slug}${searchQuery ? `&q=${searchQuery}` : ''}`}
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        categoryFilter === cat.slug ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-gray-100 hover:text-text'
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
