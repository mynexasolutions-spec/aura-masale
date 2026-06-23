import { Mail, Phone, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Contact Us | Aura Masale',
  description: 'Get in touch with the Aura Masale team for any queries, bulk orders, or support.',
}

export default function ContactPage() {
  return (
    <div className="bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Have a question about our spices, shipping, or bulk orders? We would love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-text mb-8">Contact Information</h2>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-medium text-text">Our Store</h3>
                  <p className="mt-2 text-text-muted">
                    123 Spice Market, <br />
                    Chandni Chowk, <br />
                    New Delhi, India 110006
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-medium text-text">Phone</h3>
                  <p className="mt-2 text-text-muted">
                    Mon-Fri from 9am to 6pm IST<br />
                    +91 98765 43210
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-medium text-text">Email</h3>
                  <p className="mt-2 text-text-muted">
                    We'll respond as soon as possible.<br />
                    hello@auramasale.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
            <h2 className="text-2xl font-bold text-text mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-text">First name</label>
                  <div className="mt-2">
                    <input type="text" name="first-name" id="first-name" className="block w-full rounded-md border-0 py-1.5 text-text shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                  </div>
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-text">Last name</label>
                  <div className="mt-2">
                    <input type="text" name="last-name" id="last-name" className="block w-full rounded-md border-0 py-1.5 text-text shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-text">Email address</label>
                <div className="mt-2">
                  <input type="email" name="email" id="email" className="block w-full rounded-md border-0 py-1.5 text-text shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium leading-6 text-text">Message</label>
                <div className="mt-2">
                  <textarea name="message" id="message" rows={4} className="block w-full rounded-md border-0 py-1.5 text-text shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"></textarea>
                </div>
              </div>

              <div>
                <button type="button" className="w-full rounded-md bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors">
                  Send Message
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
