'use client'

import { useState } from 'react'

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
        
        <button className="flex-1 bg-primary text-white font-bold rounded-full h-12 hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          Add to Cart
        </button>
      </div>
      
      <p className="mt-4 text-sm text-text-muted text-center">
        {selectedVariant?.stock_quantity && selectedVariant.stock_quantity < 10 && (
          <span className="text-orange-600">Only {selectedVariant.stock_quantity} left in stock!</span>
        )}
      </p>
    </div>
  )
}
