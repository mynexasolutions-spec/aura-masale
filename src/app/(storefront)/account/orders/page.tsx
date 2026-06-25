import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react'

export const metadata = {
  title: 'My Orders | Aura Masale',
}

const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
  pending: { label: 'Pending', color: 'text-orange-600 bg-orange-50 border-orange-200', icon: Clock },
  processing: { label: 'Processing', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Package },
  shipped: { label: 'Shipped', color: 'text-indigo-600 bg-indigo-50 border-indigo-200', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle },
}

export default async function AccountOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch orders with their items
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-white rounded-2xl border border-border p-6 lg:p-8 min-h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">My Orders</h1>
          <p className="text-sm text-text-muted mt-1">View and track your recent purchases.</p>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-16 bg-surface-dark/50 rounded-2xl border border-border border-dashed">
          <Package className="mx-auto h-12 w-12 text-text-muted opacity-50 mb-3" />
          <h3 className="text-sm font-medium text-text">No orders yet</h3>
          <p className="mt-1 text-sm text-text-muted mb-6">When you place an order, it will appear here.</p>
          <Link 
            href="/shop"
            className="inline-flex items-center px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-light transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.order_status]?.icon || Package
            
            return (
              <div key={order.id} className="border border-border rounded-2xl overflow-hidden">
                {/* Order Header */}
                <div className="bg-surface p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                    <div>
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Order Placed</p>
                      <p className="text-sm font-medium text-text">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Total</p>
                      <p className="text-sm font-medium text-text">₹{order.total_amount}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Order #</p>
                      <p className="text-sm font-medium text-text">{order.order_number}</p>
                    </div>
                  </div>
                  
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${statusConfig[order.order_status]?.color || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig[order.order_status]?.label || order.order_status}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-5 sm:p-6 bg-white">
                  <div className="space-y-4">
                    {order.order_items.map((item: any) => (
                      <div key={item.id} className="flex items-start justify-between gap-4 py-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-text">{item.product_name}</h4>
                          <p className="text-sm text-text-muted mt-0.5">{item.variant_name}</p>
                          <p className="text-sm text-text-muted mt-0.5">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-bold text-text">
                          ₹{item.line_total}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm">
                    <span className="text-text-muted">
                      Payment: <span className="font-medium text-text">{order.payment_method}</span> ({order.payment_status})
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
