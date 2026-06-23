'use client'

import { useActionState } from 'react'
import { createCategory, updateCategory, type ActionResult } from '@/actions/categories'
import Link from 'next/link'
import { Save, ArrowLeft } from 'lucide-react'
import type { Category } from '@/types/database'

interface CategoryFormProps {
  category?: Category
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const isEditing = !!category
  const action = isEditing ? updateCategory : createCategory

  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    action,
    {}
  )

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden ID for edit */}
      {isEditing && <input type="hidden" name="id" value={category.id} />}

      {/* Error */}
      {state.error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {state.error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-stone-200/80 p-6 space-y-5">
        {/* Name */}
        <div>
          <label
            htmlFor="category-name"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            id="category-name"
            name="name"
            type="text"
            required
            defaultValue={category?.name || ''}
            placeholder="e.g. Whole Spices"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all duration-200"
          />
          <p className="text-xs text-stone-400 mt-1.5">
            A URL-friendly slug will be auto-generated from the name.
          </p>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="category-description"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Description
          </label>
          <textarea
            id="category-description"
            name="description"
            rows={3}
            defaultValue={category?.description || ''}
            placeholder="Optional description for this category"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all duration-200 resize-none"
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3">
          <input
            id="category-active"
            name="is_active"
            type="checkbox"
            defaultChecked={category?.is_active ?? true}
            className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
          />
          <label
            htmlFor="category-active"
            className="text-sm font-medium text-stone-700"
          >
            Active — visible to customers
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
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
          {isEditing ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  )
}
