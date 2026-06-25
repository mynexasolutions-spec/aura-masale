'use client'

import { useState, useRef } from 'react'
import { submitInquiry } from '@/actions/contact'
import { Loader2, CheckCircle } from 'lucide-react'

export function ContactForm() {
  const [isPending, setIsPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const result = await submitInquiry(formData)

    if (result.success) {
      setSuccess(true)
      formRef.current?.reset()
    } else {
      setError(result.error || 'Failed to submit.')
    }

    setIsPending(false)
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-text mb-2">Message Sent!</h2>
        <p className="text-text-muted">
          Thank you for reaching out to Aura Masale. We have received your message and will get back to you shortly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-8 text-sm font-semibold text-primary hover:text-primary-light transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
      <h2 className="text-2xl font-bold text-text mb-6">Send us a Message</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 text-sm font-medium rounded-lg">
          {error}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-text">First name</label>
            <div className="mt-2">
              <input required type="text" name="first-name" id="first-name" className="block w-full rounded-md border-0 py-1.5 text-text shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-text">Last name</label>
            <div className="mt-2">
              <input required type="text" name="last-name" id="last-name" className="block w-full rounded-md border-0 py-1.5 text-text shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-text">Email address</label>
          <div className="mt-2">
            <input required type="email" name="email" id="email" className="block w-full rounded-md border-0 py-1.5 text-text shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium leading-6 text-text">Message</label>
          <div className="mt-2">
            <textarea required name="message" id="message" rows={4} className="block w-full rounded-md border-0 py-1.5 text-text shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"></textarea>
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  )
}
