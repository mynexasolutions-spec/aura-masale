'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
})

export function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { itemCount } = useCart()

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchOpen(false)
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F5E6C8] border-b border-[#E8B96A] shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Mobile Left: Hamburger */}
          <div className="flex flex-1 items-center lg:hidden">
            <button
              type="button"
              className="-ml-2 p-2 text-stone-800 hover:text-orange-600 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop Left: Logo */}
          <div className="hidden lg:flex lg:flex-1 lg:items-center">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3">
              <span className="sr-only">Aura Masale</span>
              <Image
                src="/logo.webp"
                alt="Aura Masale Logo"
                width={240}
                height={80}
                className="h-16 w-auto"
                priority
              />
              <span className={`${playfair.className} text-stone-900 text-2xl font-bold tracking-wide uppercase hidden xl:block`}>
                Aura Masale
              </span>
            </Link>
          </div>

          {/* Mobile Center: Logo */}
          <div className="flex justify-center lg:hidden">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Aura Masale</span>
              <Image
                src="/logo.webp"
                alt="Aura Masale Logo"
                width={200}
                height={64}
                className="h-16 w-auto object-contain scale-110 origin-center"
                priority
              />
            </Link>
          </div>

          {/* Desktop Center: Nav Links */}
          <div className="hidden lg:flex lg:gap-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-semibold leading-6 text-stone-800 hover:text-orange-600 transition-colors uppercase tracking-wider"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right: Search, Cart & Account */}
          <div className="flex flex-1 items-center justify-end gap-x-4 sm:gap-x-6 lg:ml-10">
            
            {/* Desktop Inline Search */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex relative w-full max-w-xs xl:max-w-md mr-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search spices..."
                className="w-full rounded-full border border-[#E8B96A] bg-stone-50 py-2 pl-4 pr-10 text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#E8B96A] focus:border-[#E8B96A] transition-all placeholder:text-stone-500 shadow-inner"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-orange-600 transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </form>

            {/* Mobile Search Icon */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden text-stone-800 hover:text-orange-600 transition-colors p-2 -mr-2"
            >
              <span className="sr-only">Search</span>
              {searchOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Search className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
            
            <div className="hidden lg:block w-px h-6 bg-stone-200"></div>
            
            {/* Desktop Auth/Account */}
            <div className="hidden lg:flex items-center gap-4">
              {isLoggedIn ? (
                <Link href="/account" className="text-stone-800 hover:text-orange-600 transition-colors p-2 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Account</span>
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 px-5 py-2 rounded-md transition-colors shadow-sm shadow-orange-600/20 whitespace-nowrap">
                    Login / Sign up
                  </Link>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link href="/cart" className="group flex items-center text-stone-800 hover:text-orange-600 transition-colors p-2 -mr-2 lg:mr-0 relative">
              <span className="sr-only">Cart</span>
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-600 rounded-full shadow-sm shadow-orange-600/30">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Search Overlay/Bar */}
      <div 
        className={`absolute top-full left-0 w-full bg-white border-b border-stone-200 shadow-md overflow-hidden transition-all duration-300 ease-in-out ${
          searchOpen ? 'max-h-24 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for spices, blends..."
              className="w-full rounded-full border border-[#E8B96A] bg-white py-3 pl-5 pr-12 text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-stone-500 hover:text-orange-600 transition-colors">
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm border-r border-stone-200">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">Aura Masale</span>
                <Image
                  src="/logo.webp"
                  alt="Aura Masale Logo"
                  width={200}
                  height={64}
                  className="h-12 w-auto"
                />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-stone-800 hover:text-orange-600 hover:bg-stone-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-stone-100">
                <div className="space-y-2 py-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-stone-800 hover:bg-stone-50 hover:text-orange-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  {isLoggedIn ? (
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-stone-800 hover:bg-stone-50 hover:text-orange-600 transition-colors"
                    >
                      <User className="h-5 w-5" />
                      Account
                    </Link>
                  ) : (
                    <div className="mt-4 flex flex-col gap-3">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-center rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white bg-orange-600 hover:bg-orange-500 transition-colors shadow-sm shadow-orange-600/20"
                      >
                        Login / Sign up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
