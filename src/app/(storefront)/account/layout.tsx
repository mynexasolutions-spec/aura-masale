import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, MapPin, Package, LogOut } from 'lucide-react'
import { AccountNav } from '@/components/storefront/AccountNav'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  return (
    <div className="bg-surface py-12 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 mb-8 lg:mb-0">
            <div className="bg-white rounded-2xl border border-border p-6 mb-6">
              <h2 className="text-xl font-bold text-text truncate">
                {profile?.full_name || 'My Account'}
              </h2>
              <p className="text-sm text-text-muted truncate mt-1">{profile?.email}</p>
            </div>
            
            <nav className="bg-white rounded-2xl border border-border overflow-hidden">
              <AccountNav isAdmin={isAdmin} />
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            {children}
          </main>

        </div>
      </div>
    </div>
  )
}
