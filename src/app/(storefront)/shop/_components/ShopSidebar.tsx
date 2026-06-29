'use client'

import Link from 'next/link'
import { Search, ChevronDown } from 'lucide-react'
import { useState } from 'react'

type Category = {
  id: string
  name: string
  slug: string
}

export function ShopSidebar({ 
  categories, 
  categoryFilter, 
  searchQuery 
}: { 
  categories: Category[]
  categoryFilter: string | null
  searchQuery: string | null
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-28">
      {/* Search Box */}
      <form action="/shop" className="mb-6 relative">
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

      {/* Categories - Mobile Dropdown & Desktop List */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        
        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full lg:hidden flex items-center justify-between p-5 text-stone-900 font-bold"
        >
          <span>Categories</span>
          <ChevronDown className={`w-5 h-5 text-stone-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Desktop Header */}
        <h3 className="hidden lg:block text-lg font-bold text-stone-900 p-6 pb-2">Categories</h3>

        {/* List Content */}
        <div className={`grid transition-all duration-300 ease-in-out lg:grid-rows-[1fr] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <ul className="space-y-1.5 p-4 lg:p-6 lg:pt-2 pt-0">
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
              {categories.map((cat) => (
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
      </div>
    </div>
  )
}
