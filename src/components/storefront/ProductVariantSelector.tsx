'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Truck, Package, MapPin, Check } from 'lucide-react'
import { addToCart } from '@/actions/cart'
import { useCart } from '@/contexts/CartContext'

type Variant = {
  id: string
  variant_name: string
  price: number
  original_price: number | null
  stock_quantity: number
  is_active: boolean
}

export function ProductVariantSelector({ variants }: { variants: Variant[] }) {
  const activeVariants = variants.filter(v => v.is_active && v.stock_quantity > 0)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(activeVariants.length > 0 ? activeVariants[0] : null)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [addedSuccess, setAddedSuccess] = useState(false)
  const router = useRouter()
  const { refreshCart } = useCart()

  if (activeVariants.length === 0) {
    return (
      <div className="py-4">
        <span className="text-xl font-bold text-gray-500">Out of Stock</span>
        <button disabled className="mt-6 w-full rounded-full bg-gray-300 py-3.5 px-8 text-white font-bold cursor-not-allowed">
          Sold Out
        </button>
      </div>
    )
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) return
    setIsAdding(true)
    
    const result = await addToCart(selectedVariant.id, quantity)
    
    if (result.success) {
      setAddedSuccess(true)
      refreshCart()
      setTimeout(() => setAddedSuccess(false), 2000)
    } else {
      alert(result.error || 'Failed to add to cart')
    }
    
    setIsAdding(false)
  }

  return (
    <div className="mt-8">
      {/* Price Display */}
      <div className="flex items-end gap-3 mb-8">
        <span className="text-4xl font-bold text-primary">₹{selectedVariant?.price}</span>
        {selectedVariant?.original_price && (
          <span className="text-xl text-text-muted line-through mb-1">₹{selectedVariant.original_price}</span>
        )}
      </div>

      {/* Variant Selection */}
      {activeVariants.length > 1 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-text uppercase tracking-wider mb-3">Available Options</h3>
          <div className="flex flex-wrap gap-3">
            {activeVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${
                  selectedVariant?.id === variant.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-white text-text hover:border-primary/50'
                }`}
              >
                {variant.variant_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="flex gap-4">
        <div className="flex items-center border border-border rounded-full bg-white h-12">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 text-text hover:text-primary transition-colors h-full rounded-l-full"
          >
            -
          </button>
          <span className="w-8 text-center font-medium text-text">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(selectedVariant?.stock_quantity || 1, quantity + 1))}
            className="px-4 text-text hover:text-primary transition-colors h-full rounded-r-full"
          >
            +
          </button>
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={isAdding || addedSuccess}
          className={`flex-1 font-bold rounded-full h-12 transition-all duration-300 inline-flex items-center justify-center gap-2 ${
            addedSuccess
              ? 'bg-green-500 text-white'
              : 'bg-primary text-white hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70'
          }`}
        >
          {isAdding ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : addedSuccess ? (
            <>
              <Check className="w-5 h-5" />
              Added to Cart!
            </>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
      
      <p className="mt-4 text-sm text-text-muted text-center">
        {selectedVariant?.stock_quantity && selectedVariant.stock_quantity < 10 && (
          <span className="text-orange-600">Only {selectedVariant.stock_quantity} left in stock!</span>
        )}
      </p>

      {/* Trust Badges */}
      <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium text-text">Secure payments via Razorpay</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Truck className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium text-text">Rs. 90 shipping charges</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Package className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium text-text">Free delivery above Rs. 500</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium text-text">All India delivery</span>
        </div>
      </div>
    </div>
  )
}
