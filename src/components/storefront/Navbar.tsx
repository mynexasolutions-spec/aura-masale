'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-surface border-b border-border shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Mobile Left: Hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="-ml-2 p-2 text-text hover:text-primary"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop Left: Logo */}
          <div className="hidden lg:flex lg:flex-1 lg:items-center">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Aura Masale</span>
              <Image
                src="/logo.svg"
                alt="Aura Masale Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Mobile Center: Logo */}
          <div className="flex flex-1 justify-center lg:hidden">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Aura Masale</span>
              <Image
                src="/logo.svg"
                alt="Aura Masale Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
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
                className="text-sm font-semibold leading-6 text-text hover:text-primary transition-colors uppercase tracking-wider"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right: Icons (Desktop & Mobile) */}
          <div className="flex flex-1 items-center justify-end gap-x-4 sm:gap-x-6">
            <button className="text-text hover:text-primary transition-colors p-2 -mr-2">
              <span className="sr-only">Search</span>
              <Search className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <div className="hidden lg:block w-px h-6 bg-border"></div>
            <Link href="/account" className="hidden lg:block text-text hover:text-primary transition-colors p-2">
              <span className="sr-only">Account</span>
              <User className="h-6 w-6" />
            </Link>
            <Link href="/cart" className="group flex items-center text-text hover:text-primary transition-colors p-2 -mr-2 lg:mr-0 relative">
              <span className="sr-only">Cart</span>
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {/* Cart Badge Example */}
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full">
                0
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-surface px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">Aura Masale</span>
                <Image
                  src="/logo.svg"
                  alt="Aura Masale Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-text hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-border">
                <div className="space-y-2 py-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-text hover:bg-surface-dark hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-text hover:bg-surface-dark hover:text-white transition-colors"
                  >
                    <User className="h-5 w-5" />
                    Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
