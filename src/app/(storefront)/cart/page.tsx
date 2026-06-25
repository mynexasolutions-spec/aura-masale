import { getCart } from '@/actions/cart'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CartItemsList } from './_components/CartItemsList'

export const metadata = {
  title: 'Your Cart | Aura Masale',
}

export default async function CartPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { items } = await getCart()

  return (
    <div className="bg-surface py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-text mb-10">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-border">
            <svg className="mx-auto h-16 w-16 text-text-muted opacity-40" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-text">Your cart is empty</h3>
            <p className="mt-2 text-sm text-text-muted">Looks like you haven&apos;t added any spices yet!</p>
            <Link 
              href="/shop" 
              className="mt-8 inline-flex items-center px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-light transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <CartItemsList initialItems={items} />
        )}
      </div>
    </div>
  )
}
