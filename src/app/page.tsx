import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, LogIn, UserPlus } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col">
      {/* Header */}
      <header className="border-b border-amber-100/50 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md shadow-amber-500/20">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-stone-900">
              Aura Masale
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            {user ? (
              <Link
                href="/account"
                className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors"
              >
                My Account
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-3xl mx-auto text-center px-4 py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-700 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            Premium Indian Spices
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-tight mb-6">
            Flavors that bring{' '}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Aura
            </span>{' '}
            to every meal
          </h1>
          <p className="text-lg text-stone-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Discover our handpicked collection of whole spices, ground spices,
            and artisanal spice blends — crafted for the modern Indian kitchen.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:from-amber-600 hover:to-orange-700 transition-all duration-300"
            >
              Shop Now
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-700 font-semibold rounded-xl border border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-all duration-300"
            >
              Our Story
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
