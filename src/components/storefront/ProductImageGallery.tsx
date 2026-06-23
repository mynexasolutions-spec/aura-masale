'use client'

import { useState } from 'react'
import Image from 'next/image'

type ProductImageGalleryProps = {
  images: { id: string; image_url: string; sort_order: number }[]
  featuredImage: string | null
}

export function ProductImageGallery({ images, featuredImage }: ProductImageGalleryProps) {
  // If there are no uploaded images, but there is a featured image (e.g. from the old basic URL), 
  // we just use that as a single item array.
  const allImages = images.length > 0 
    ? [...images].sort((a, b) => a.sort_order - b.sort_order).map(i => i.image_url)
    : featuredImage ? [featuredImage] : []

  const [activeImage, setActiveImage] = useState<string | null>(allImages.length > 0 ? allImages[0] : null)

  if (allImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center border border-border">
        <span className="text-gray-400 font-medium">No Image Available</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:w-24 flex-shrink-0 hide-scrollbar pb-2 lg:pb-0">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`relative aspect-square w-20 lg:w-full flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                activeImage === img ? 'border-primary shadow-sm' : 'border-transparent hover:border-primary/50 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-border">
        {activeImage && (
          <Image
            src={activeImage}
            alt="Product Image"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        )}
      </div>
    </div>
  )
}
