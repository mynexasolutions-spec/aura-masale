'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Plus, ShieldCheck, CheckCircle, CreditCard } from 'lucide-react'
import { createOrder, verifyRazorpayPayment } from '@/actions/checkout'
import { useCart } from '@/contexts/CartContext'
import Script from 'next/script'

type Address = {
  id: string
  full_name: string
  phone: string
  address_line_1: string
  address_line_2: string | null
  city: string
  state: string
  postal_code: string
  is_default: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CheckoutClient({ initialItems, addresses }: { initialItems: any[], addresses: Address[] }) {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find(a => a.is_default)?.id || (addresses.length > 0 ? addresses[0].id : null)
  )
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('COD')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const { refreshCart } = useCart()

  const subtotal = initialItems.reduce((sum, item) => {
    return sum + (item.product_variants.price * item.quantity)
  }, 0)

  const FREE_SHIPPING_THRESHOLD = 500
  const SHIPPING_COST = 90
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select a shipping address.')
      return
    }

    setIsPlacingOrder(true)
    setError(null)

    const result = await createOrder(selectedAddressId, paymentMethod)

    if (!result.success) {
      setError(result.error || 'Something went wrong while placing your order.')
      setIsPlacingOrder(false)
      return
    }

    if (result.isRazorpay && result.razorpayOrderId) {
      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '', // Enter the Key ID generated from the Dashboard
        amount: result.amount, // Amount is in currency subunits
        currency: 'INR',
        name: 'Aura Masale',
        description: 'Premium Spices Order',
        order_id: result.razorpayOrderId,
        handler: async function (response: any) {
          setIsPlacingOrder(true)
          const verifyResult = await verifyRazorpayPayment(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature,
            result.orderId
          )

          if (verifyResult.success) {
            refreshCart()
            router.push(`/checkout/success?order_number=${result.orderNumber}`)
          } else {
            setError(verifyResult.error || 'Payment verification failed.')
            setIsPlacingOrder(false)
          }
        },
        prefill: {
          name: addresses.find(a => a.id === selectedAddressId)?.full_name || '',
          contact: addresses.find(a => a.id === selectedAddressId)?.phone || '',
        },
        theme: {
          color: '#d97706' // orange-600
        }
      }

      // @ts-ignore
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response: any){
        setError(`Payment Failed: ${response.error.description}`)
        setIsPlacingOrder(false)
      })
      rzp.open()
    } else {
      // COD Flow
      refreshCart()
      router.push(`/checkout/success?order_number=${result.order_number}`)
    }
  }

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      {/* Main Checkout Area */}
      <section className="lg:col-span-7 space-y-10">
        
        {/* Addresses */}
        <div className="bg-white rounded-2xl border border-border p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm">1</span>
              Shipping Address
            </h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 text-sm font-medium rounded-lg">
              {error}
            </div>
          )}

          {addresses.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-border rounded-xl bg-surface-dark/50">
              <MapPin className="mx-auto h-10 w-10 text-text-muted opacity-50 mb-3" />
              <h3 className="text-sm font-medium text-text">No address found</h3>
              <p className="mt-1 text-sm text-text-muted mb-4">Please add a shipping address to continue.</p>
              <Link 
                href="/account/addresses"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-light transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Address
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <label 
                  key={address.id} 
                  className={`relative flex cursor-pointer rounded-xl border p-5 transition-all ${
                    selectedAddressId === address.id 
                      ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm' 
                      : 'border-border bg-white hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary mt-1"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="block text-sm font-bold text-text">{address.full_name}</span>
                      {address.is_default && (
                        <span className="inline-flex items-center gap-1 bg-primary text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <span className="block text-sm text-text-muted mt-1">{address.phone}</span>
                    <span className="block text-sm text-text mt-2 leading-relaxed">
                      {address.address_line_1}
                      {address.address_line_2 && <>, {address.address_line_2}</>}
                      <br />
                      {address.city}, {address.state} {address.postal_code}
                    </span>
                  </div>
                </label>
              ))}

              <div className="mt-6 pt-6 border-t border-border">
                <Link 
                  href="/account/addresses"
                  className="text-sm font-semibold text-primary hover:text-primary-light transition-colors"
                >
                  + Add a new address
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl border border-border p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm">2</span>
              Payment Method
            </h2>
          </div>
          
          <div className="space-y-4">
            {/* COD Option */}
            <label className={`relative flex cursor-pointer rounded-xl border p-5 transition-all ${
                paymentMethod === 'COD' 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm' 
                  : 'border-border bg-white hover:border-primary/50'
              }`}
            >
              <div className="flex items-center h-5">
                <input
                  type="radio"
                  name="payment_method"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary mt-1"
                />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-bold text-text text-sm flex items-center gap-2">
                  <CheckCircle className={`w-5 h-5 ${paymentMethod === 'COD' ? 'text-primary' : 'text-text-muted'}`} />
                  Cash on Delivery (COD)
                </h3>
                <p className="text-sm text-text-muted mt-1 leading-relaxed">Pay with cash when your order is delivered to your doorstep.</p>
              </div>
            </label>

            {/* Razorpay Option */}
            <label className={`relative flex cursor-pointer rounded-xl border p-5 transition-all ${
                paymentMethod === 'RAZORPAY' 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm' 
                  : 'border-border bg-white hover:border-primary/50'
              }`}
            >
              <div className="flex items-center h-5">
                <input
                  type="radio"
                  name="payment_method"
                  value="RAZORPAY"
                  checked={paymentMethod === 'RAZORPAY'}
                  onChange={() => setPaymentMethod('RAZORPAY')}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary mt-1"
                />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-bold text-text text-sm flex items-center gap-2">
                  <CreditCard className={`w-5 h-5 ${paymentMethod === 'RAZORPAY' ? 'text-primary' : 'text-text-muted'}`} />
                  Online Payment
                </h3>
                <p className="text-sm text-text-muted mt-1 leading-relaxed">Securely pay via UPI, Credit/Debit Cards, or Netbanking using Razorpay.</p>
              </div>
            </label>
          </div>
          
          <div className="mt-4 p-4 border border-border bg-surface-dark rounded-xl flex items-start gap-3">
             <ShieldCheck className="w-5 h-5 text-text-muted shrink-0 mt-0.5" />
             <p className="text-xs text-text-muted leading-relaxed">
               All transactions are encrypted and secured. Your payment information is not stored on our servers.
             </p>
          </div>
        </div>

      </section>

      {/* Order Summary Sidebar */}
      <section className="mt-10 lg:mt-0 lg:col-span-5">
        <div className="bg-white rounded-2xl border border-border p-6 lg:p-8 sticky top-28">
          <h2 className="text-xl font-bold text-text mb-6">Order Summary</h2>

          {/* Items */}
          <div className="flow-root mb-6">
            <ul className="-my-4 divide-y divide-border">
              {initialItems.map((item) => (
                <li key={item.id} className="flex py-4 gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-dark relative">
                     {item.product_variants.products.featured_image_url && (
                        <Image
                          src={item.product_variants.products.featured_image_url}
                          alt={item.product_variants.products.name}
                          fill
                          className="object-cover"
                        />
                     )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-sm font-medium text-text">
                      <h3 className="line-clamp-1">{item.product_variants.products.name}</h3>
                      <p className="ml-4 whitespace-nowrap">₹{(item.product_variants.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-xs text-text-muted">{item.product_variants.variant_name}</p>
                    <p className="mt-1 text-xs text-text-muted">Qty {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 pt-6 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Subtotal</span>
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

            <div className="border-t border-border pt-4 flex justify-between items-center">
              <span className="text-base font-bold text-text">Total</span>
              <span className="text-2xl font-bold text-primary">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || addresses.length === 0}
            className="mt-8 w-full inline-flex items-center justify-center py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {isPlacingOrder ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              `Place Order • ₹${total.toFixed(2)}`
            )}
          </button>
        </div>
      </section>
    </div>
  )
}
