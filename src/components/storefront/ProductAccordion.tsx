'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

type ProductAccordionProps = {
  faqs: { id: string; question: string; answer: string }[]
}

export function ProductAccordion({ faqs }: ProductAccordionProps) {
  // If there's at least one FAQ, open the first one by default
  const [openSections, setOpenSections] = useState<string[]>(
    faqs.length > 0 ? [faqs[0].id] : []
  )

  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  if (faqs.length === 0) return null

  return (
    <div className="border-t border-border">
      {faqs.map((faq) => {
        const isOpen = openSections.includes(faq.id)
        return (
          <div key={faq.id} className="border-b border-border">
            <button
              onClick={() => toggleSection(faq.id)}
              className="w-full flex items-center justify-between py-6 text-left group"
            >
              <span className="text-lg font-bold text-text group-hover:text-primary transition-colors pr-8">
                {faq.question}
              </span>
              <ChevronDown className={`w-5 h-5 flex-shrink-0 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[1000px] opacity-100 pb-6' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="prose prose-sm text-text-muted max-w-none whitespace-pre-wrap">
                {faq.answer}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
