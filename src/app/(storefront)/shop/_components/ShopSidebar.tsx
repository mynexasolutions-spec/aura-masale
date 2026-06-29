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
          className="w-full rounded-2xl border border-[#E8B96A] bg-white py-3 pl-4 pr-12 text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all placeholder:text-stone-400 shadow-sm"
        />
        {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-orange-600 transition-colors p-2">
          <Search className="h-5 w-5" />
        </button>
      </form>

      {/* Categories - Mobile Dropdown & Desktop List */}
      <div className="bg-white rounded-md border border-[#E8B96A] shadow-sm overflow-hidden">

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full lg:hidden flex items-center justify-between p-4 bg-[#E8B96A] text-stone-900 font-bold border-b border-[#E8B96A]"
        >
          <span className="w-full text-center pl-6">CATEGORIES</span>
          <ChevronDown className={`w-5 h-5 text-stone-700 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-[#E8B96A] text-stone-900 text-center py-4 border-b border-[#E8B96A]">
          <h3 className="text-sm font-bold uppercase tracking-wider">Categories</h3>
        </div>

        {/* List Content */}
        <div className={`grid transition-all duration-300 ease-in-out lg:grid-rows-[1fr] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <ul className="space-y-1.5 p-4 lg:p-5">
              <li className="mb-4">
                <Link
                  href={`/shop${searchQuery ? `?q=${searchQuery}` : ''}`}
                  className={`block text-center px-4 py-2.5 rounded-md text-xs font-bold tracking-wider uppercase transition-all duration-200 border ${
                    !categoryFilter 
                      ? 'bg-stone-100 text-stone-900 border-stone-300 shadow-inner' 
                      : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
                  }`}
                >
                  All Spices
                </Link>
              </li>
              {categories.map((cat) => {
                const isActive = categoryFilter === cat.slug;
                return (
                  <li key={cat.id}>
                    <Link
                      href={`/shop?category=${cat.slug}${searchQuery ? `&q=${searchQuery}` : ''}`}
                      className={`group flex items-center py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive
                          ? 'text-orange-700 bg-orange-50/50 pl-3 font-semibold'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 pl-2 hover:pl-3'
                        }`}
                    >
                      {isActive ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-600 mr-2.5 shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-stone-300 mr-2.5 shrink-0 transition-colors" />
                      )}
                      {cat.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
