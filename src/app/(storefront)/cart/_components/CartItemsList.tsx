'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { removeFromCart, updateCartQuantity } from '@/actions/cart'
import { useCart } from '@/contexts/CartContext'

type CartItem = {
  id: string
  quantity: number
  variant_id: string
  product_variants: {
    id: string
    variant_name: string
    price: number
    original_price: number | null
    stock_quantity: number
    is_active: boolean
    product_id: string
    products: {
      id: string
      name: string
      slug: string
      featured_image_url: string | null
    }
  }
}

const FREE_SHIPPING_THRESHOLD = 500
const SHIPPING_COST = 90

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CartItemsList({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState<CartItem[]>(initialItems as CartItem[])
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const { refreshCart } = useCart()

  const handleRemove = async (id: string) => {
    setLoadingId(id)
    const result = await removeFromCart(id)
    if (result.success) {
      setItems(items.filter(i => i.id !== id))
      refreshCart()
    }
    setLoadingId(null)
  }

  const handleQuantityChange = async (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemove(id)
      return
    }
    setLoadingId(id)
    const result = await updateCartQuantity(id, newQty)
    if (result.success) {
      setItems(items.map(item => item.id === id ? { ...item, quantity: newQty } : item))
      refreshCart()
    }
    setLoadingId(null)
  }

  const subtotal = items.reduce((sum, item) => {
    return sum + (item.product_variants.price * item.quantity)
  }, 0)

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
      
      {/* Cart Items */}
      <section className="lg:col-span-7">
        <div className="space-y-6">
          {items.map((item) => {
            const variant = item.product_variants
            const product = variant.products
            const isLoading = loadingId === item.id

            return (
              <div 
                key={item.id} 
                className={`flex gap-6 bg-white rounded-2xl border border-border p-6 transition-opacity ${isLoading ? 'opacity-60' : ''}`}
              >
                {/* Image */}
                <Link href={`/product/${product.slug}`} className="shrink-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-surface-dark relative">
                    {product.featured_image_url ? (
                      <Image
                        src={product.featured_image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="text-base font-bold text-text truncate hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-text-muted mt-1">{variant.variant_name}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-lg font-bold text-primary">₹{variant.price}</span>
                    {variant.original_price && (
                      <span className="text-sm text-text-muted line-through">₹{variant.original_price}</span>
                    )}
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border border-border rounded-full bg-surface h-10">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={isLoading}
                        className="px-3 text-text hover:text-primary transition-colors h-full rounded-l-full disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium text-text text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={isLoading || item.quantity >= variant.stock_quantity}
                        className="px-3 text-text hover:text-primary transition-colors h-full rounded-r-full disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={isLoading}
                      className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8">
          <Link 
            href="/shop" 
            className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-light transition-colors"
          >
            ← Continue Shopping
          </Link>
        </div>
      </section>

      {/* Order Summary */}
      <section className="mt-10 lg:mt-0 lg:col-span-5">
        <div className="bg-white rounded-2xl border border-border p-6 lg:p-8 sticky top-28">
          <h2 className="text-xl font-bold text-text mb-6">Order Summary</h2>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span className="font-medium text-text">₹{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Shipping</span>
              {shipping === 0 ? (
                <span className="font-medium text-green-600">FREE</span>
              ) : (
                <span className="font-medium text-text">₹{shipping.toFixed(2)}</span>
              )}
            </div>

            {subtotal < FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-xs text-orange-700 font-medium">
                  Add ₹{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for <strong>free shipping!</strong>
                </p>
                <div className="mt-2 w-full bg-orange-200 rounded-full h-1.5">
                  <div 
                    className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="border-t border-border pt-4 flex justify-between">
              <span className="text-base font-bold text-text">Total</span>
              <span className="text-xl font-bold text-primary">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <Link 
            href="/checkout"
            className="mt-8 w-full inline-flex items-center justify-center py-3.5 bg-primary text-white font-bold rounded-full hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center"
          >
            Proceed to Checkout
          </Link>

          {/* Trust line */}
          <p className="mt-4 text-xs text-text-muted text-center">
            Secure checkout powered by Razorpay
          </p>
        </div>
      </section>
    </div>
  )
}
