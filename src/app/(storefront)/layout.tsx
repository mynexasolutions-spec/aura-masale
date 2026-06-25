import { Navbar } from '@/components/storefront/Navbar'
import { Footer } from '@/components/storefront/Footer'
import { CartProvider } from '@/contexts/CartContext'
import { getCartCount } from '@/actions/cart'
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar'
import { FloatingContact } from '@/components/storefront/FloatingContact'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: {
    template: '%s | Aura Masale',
    default: 'Aura Masale | Premium Indian Spices',
  },
  description: 'Bringing the authentic, rich flavors of traditional Indian spices right to your kitchen.',
}

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const cartCount = await getCartCount()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  return (
    <CartProvider initialCount={cartCount}>
      <div className="min-h-screen flex flex-col bg-surface">
        <AnnouncementBar />
        <Navbar isLoggedIn={isLoggedIn} />
        <main className="flex-grow">{children}</main>
        <Footer />
        <FloatingContact />
      </div>
    </CartProvider>
  )
}
