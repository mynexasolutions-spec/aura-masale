'use client'

import { useActionState } from 'react'
import {
  createProduct,
  updateProduct,
  type ActionResult,
} from '@/actions/products'
import Link from 'next/link'
import { Save, ArrowLeft } from 'lucide-react'
import type { Category, Product } from '@/types/database'

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const isEditing = !!product
  const action = isEditing ? updateProduct : createProduct

  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    action,
    {}
  )

  return (
    <form action={formAction} className="space-y-6">
      {isEditing && <input type="hidden" name="id" value={product.id} />}

      {/* Error */}
      {state.error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {state.error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 space-y-5">
        <h2 className="text-base font-semibold text-stone-900">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label
              htmlFor="product-name"
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="product-name"
              name="name"
              type="text"
              required
              defaultValue={product?.name || ''}
              placeholder="e.g. Turmeric Powder"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all duration-200"
            />
            <p className="text-xs text-stone-400 mt-1.5">
              Slug will be auto-generated from the name.
            </p>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="product-category"
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Category
            </label>
            <select
              id="product-category"
              name="category_id"
              defaultValue={product?.category_id || ''}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all duration-200"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label
            htmlFor="product-short-desc"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Short Description
          </label>
          <input
            id="product-short-desc"
            name="short_description"
            type="text"
            defaultValue={product?.short_description || ''}
            placeholder="Brief one-liner about the product"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all duration-200"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="product-description"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Full Description
          </label>
          <textarea
            id="product-description"
            name="description"
            rows={6}
            defaultValue={product?.description || ''}
            placeholder="Detailed product description..."
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all duration-200 resize-none"
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3">
          <input
            id="product-active"
            name="is_active"
            type="checkbox"
            defaultChecked={product?.is_active ?? true}
            className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
          />
          <label
            htmlFor="product-active"
            className="text-sm font-medium text-stone-700"
          >
            Active — visible in the store
          </label>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 space-y-5">
        <h2 className="text-base font-semibold text-stone-900">SEO</h2>

        <div>
          <label
            htmlFor="seo-title"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            SEO Title
          </label>
          <input
            id="seo-title"
            name="seo_title"
            type="text"
            defaultValue={product?.seo_title || ''}
            placeholder="Custom title for search engines"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all duration-200"
          />
        </div>

        <div>
          <label
            htmlFor="seo-description"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            SEO Description
          </label>
          <textarea
            id="seo-description"
            name="seo_description"
            rows={2}
            defaultValue={product?.seo_description || ''}
            placeholder="Meta description for search results"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all duration-200 resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
        >
          {pending ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isEditing ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}
