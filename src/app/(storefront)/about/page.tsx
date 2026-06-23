import Image from 'next/image'

export const metadata = {
  title: 'About Us | Aura Masale',
  description: 'Learn about the story behind Aura Masale and our mission to bring authentic Indian spices to the world.',
}

export default function AboutPage() {
  return (
    <div className="bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl mb-6">
              Our Story
            </h1>
            <div className="prose prose-lg text-text-muted">
              <p>
                Aura Masale was born out of a profound love for traditional Indian cooking. For generations, our family has carefully selected, roasted, and ground spices to create the perfect flavor profiles for everyday meals and special occasions alike.
              </p>
              <p className="mt-4">
                We believe that the secret to truly unforgettable food lies in the quality of its ingredients. That is why we source our spices directly from ethical farmers across India, ensuring that only the freshest, most aromatic whole spices make it to our grinding facilities.
              </p>
              <p className="mt-4">
                Every blend we offer is a piece of our heritage, crafted without any artificial colors, preservatives, or fillers. From the fiery chilies of Guntur to the fragrant cardamom of Kerala, we bring the essence of India to your kitchen.
              </p>
            </div>
            
            <div className="mt-10 border-t border-border pt-10">
              <h2 className="text-2xl font-bold text-text mb-6">Our Promise</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">1</span>
                  </div>
                  <p className="ml-4 text-base text-text-muted">
                    <strong className="text-text">100% Pure & Natural.</strong> No artificial additives or preservatives.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">2</span>
                  </div>
                  <p className="ml-4 text-base text-text-muted">
                    <strong className="text-text">Ethically Sourced.</strong> Working directly with farmers to ensure fair trade.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">3</span>
                  </div>
                  <p className="ml-4 text-base text-text-muted">
                    <strong className="text-text">Authentic Blends.</strong> Traditional recipes passed down through generations.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/5] bg-gray-200">
              {/* Fallback pattern since we don't have an image asset yet */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark">
                <span className="text-white/50 text-2xl font-bold tracking-widest uppercase rotate-[-45deg]">
                  Aura Masale Heritage
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
