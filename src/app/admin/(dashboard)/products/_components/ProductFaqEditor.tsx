'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'
import { saveProductFaqs } from '@/actions/products'

interface FaqItem {
  id?: string
  question: string
  answer: string
  display_order: number
}

export default function ProductFaqEditor({
  productId,
  initialItems,
}: {
  productId: string
  initialItems: FaqItem[]
}) {
  const [items, setItems] = useState<FaqItem[]>(
    initialItems.length > 0
      ? initialItems
      : [{ question: '', answer: '', display_order: 0 }]
  )
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const addItem = () => {
    setItems([
      ...items,
      { question: '', answer: '', display_order: items.length },
    ])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (
    index: number,
    field: 'question' | 'answer',
    value: string
  ) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  const handleSave = () => {
    const validItems = items.filter(
      (item) => item.question.trim() && item.answer.trim()
    )

    startTransition(async () => {
      const result = await saveProductFaqs(productId, validItems)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'FAQs saved!' })
        setTimeout(() => setMessage(null), 3000)
      }
    })
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200/80 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-stone-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Product-specific Q&A displayed on the product detail page
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add FAQ
        </button>
      </div>

      {message && (
        <div
          className={`p-2.5 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-stone-100 bg-stone-50/50 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium text-stone-400 bg-stone-200/60 px-2 py-0.5 rounded mt-1">
                Q{index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="text"
              value={item.question}
              onChange={(e) => updateItem(index, 'question', e.target.value)}
              placeholder="Question"
              className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all bg-white"
            />
            <textarea
              value={item.answer}
              onChange={(e) => updateItem(index, 'answer', e.target.value)}
              placeholder="Answer"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all resize-none bg-white"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 disabled:opacity-60 transition-colors"
      >
        {isPending ? (
          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Save className="w-3.5 h-3.5" />
        )}
        Save FAQs
      </button>
    </div>
  )
}
