import { Mail, Phone, MapPin } from 'lucide-react'
import { ContactForm } from '@/components/storefront/ContactForm'

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
                    T891 A/1 Aulia Masjid <br />
                    Ward No 8 Mehrauli <br />
                    New Delhi 110030
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
                    Call or WhatsApp: +91 9540048786
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
                    info@auramasale.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />

        </div>
      </div>
    </div>
  )
}
