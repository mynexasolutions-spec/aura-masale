'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

type ProductAccordionProps = {
  info: { id: string; title: string; content: string }[]
  faqs: { id: string; question: string; answer: string }[]
}

export function ProductAccordion({ info, faqs }: ProductAccordionProps) {
  const [openSections, setOpenSections] = useState<string[]>(['description']) // Open description by default

  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const sections = [
    ...info.map(i => ({ id: `info-${i.id}`, title: i.title, content: i.content })),
    ...(faqs.length > 0 ? [{
      id: 'faqs',
      title: 'Frequently Asked Questions',
      content: (
        <div className="space-y-4">
          {faqs.map(faq => (
            <div key={faq.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
              <p className="font-medium text-text mb-1">{faq.question}</p>
              <p className="text-text-muted">{faq.answer}</p>
            </div>
          ))}
        </div>
      )
    }] : [])
  ]

  if (sections.length === 0) return null

  return (
    <div className="mt-12 border-t border-border">
      {sections.map((section) => {
        const isOpen = openSections.includes(section.id)
        return (
          <div key={section.id} className="border-b border-border">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between py-6 text-left group"
            >
              <span className="text-lg font-bold text-text group-hover:text-primary transition-colors">
                {section.title}
              </span>
              <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[1000px] opacity-100 pb-6' : 'max-h-0 opacity-0'
              }`}
            >
              {typeof section.content === 'string' ? (
                <div className="prose prose-sm text-text-muted max-w-none whitespace-pre-wrap">
                  {section.content}
                </div>
              ) : (
                section.content
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
