import Link from 'next/link'
import Image from 'next/image'

type ProductCardProps = {
  id: string
  slug: string
  name: string
  shortDescription: string | null
  featuredImage: string | null
  minPrice: number | null
}

export function ProductCard({
  id,
  slug,
  name,
  shortDescription,
  featuredImage,
  minPrice,
}: ProductCardProps) {
  return (
    <Link href={`/product/${slug}`} className="group relative flex flex-col bg-white rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-300">
      
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {featuredImage ? (
          <Image
            src={featuredImage}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-dark/5">
            <span className="text-gray-400 font-medium">No Image</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors line-clamp-1">
          {name}
        </h3>
        
        {shortDescription && (
          <p className="mt-1 text-sm text-text-muted line-clamp-2">
            {shortDescription}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Starting from</span>
            <span className="text-lg font-bold text-primary">
              {minPrice !== null ? `₹${minPrice}` : 'N/A'}
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
