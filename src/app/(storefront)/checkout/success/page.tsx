import Link from 'next/link'
import { CheckCircle2, Package, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Order Confirmed | Aura Masale',
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const orderNumber = resolvedParams.order_number as string

  return (
    <div className="bg-surface py-12 min-h-screen flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-border p-8 md:p-12 text-center shadow-sm">
          
          <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-text mb-4">Order Confirmed!</h1>
          
          <p className="text-text-muted mb-8 leading-relaxed">
            Thank you for shopping with Aura Masale. Your order has been successfully placed and is now being processed.
          </p>

          {orderNumber && (
            <div className="bg-surface border border-border rounded-2xl p-6 mb-8 flex flex-col items-center justify-center">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wider mb-1">Order Number</span>
              <span className="text-2xl font-bold text-primary tracking-wide">{orderNumber}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/account/orders"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all"
            >
              <Package className="w-5 h-5" />
              View My Orders
            </Link>
            
            <Link 
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-surface text-text font-bold rounded-full border border-border hover:border-primary/30 hover:bg-surface-dark transition-all"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
