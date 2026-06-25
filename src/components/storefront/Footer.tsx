import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-surface-dark text-white pt-16 pb-8 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          
          {/* Brand & Intro */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="sr-only">Aura Masale</span>
              <Image
                src="/logo.webp"
                alt="Aura Masale Logo"
                width={240}
                height={80}
                className="h-16 w-auto" 
              />
            </Link>
            <p className="mt-4 text-sm leading-6 text-gray-300">
              Bringing the authentic, rich flavors of traditional Indian spices right to your kitchen. Ethically sourced and carefully ground for your perfect meal.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-primary-light uppercase tracking-wider">Quick Links</h3>
            <ul role="list" className="mt-6 space-y-4">
              <li>
                <Link href="/" className="text-sm leading-6 text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/shop" className="text-sm leading-6 text-gray-300 hover:text-white transition-colors">Shop</Link>
              </li>
              <li>
                <Link href="/about" className="text-sm leading-6 text-gray-300 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm leading-6 text-gray-300 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-primary-light uppercase tracking-wider">Categories</h3>
            <ul role="list" className="mt-6 space-y-4">
              <li>
                <Link href="/shop?category=whole-spices" className="text-sm leading-6 text-gray-300 hover:text-white transition-colors">Whole Spices</Link>
              </li>
              <li>
                <Link href="/shop?category=ground-spices" className="text-sm leading-6 text-gray-300 hover:text-white transition-colors">Ground Spices</Link>
              </li>
              <li>
                <Link href="/shop?category=blends" className="text-sm leading-6 text-gray-300 hover:text-white transition-colors">Spice Blends</Link>
              </li>
              <li>
                <Link href="/shop?category=herbs" className="text-sm leading-6 text-gray-300 hover:text-white transition-colors">Dried Herbs</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-primary-light uppercase tracking-wider">Get in Touch</h3>
            <ul role="list" className="mt-6 space-y-4">
              <li className="text-sm leading-6 text-gray-300">
                T891 A/1 Aulia Masjid<br />Ward No 8 Mehrauli<br />New Delhi 110030
              </li>
              <li className="text-sm leading-6 text-gray-300">
                Email: info@auramasale.com
              </li>
              <li className="text-sm leading-6 text-gray-300">
                Phone/WhatsApp: +91 9540048786
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 border-t border-gray-700 pt-8 sm:mt-20 md:flex md:items-center md:justify-between">
          <p className="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
            &copy; {new Date().getFullYear()} Aura Masale. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
