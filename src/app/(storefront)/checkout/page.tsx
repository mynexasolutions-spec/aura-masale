import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCart } from '@/actions/cart'
import { CheckoutClient } from './_components/CheckoutClient'

export const metadata = {
  title: 'Checkout | Aura Masale',
}

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/checkout')
  }

  // Get Cart
  const { items } = await getCart()
  if (!items || items.length === 0) {
    redirect('/cart')
  }

  // Get Addresses
  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="bg-surface py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-text mb-10">Checkout</h1>
        <CheckoutClient 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          initialItems={items as any[]} 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          addresses={addresses as any[] || []} 
        />
      </div>
    </div>
  )
}
