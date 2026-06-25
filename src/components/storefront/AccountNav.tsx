'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, MapPin, Package, LogOut, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function AccountNav({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const links = [
    { name: 'Profile', href: '/account', icon: User },
    { name: 'Addresses', href: '/account/addresses', icon: MapPin },
    { name: 'Orders', href: '/account/orders', icon: Package },
  ]

  return (
    <div className="flex flex-col">
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-b border-border text-orange-600 hover:bg-orange-50 border-l-4 border-l-transparent pl-5"
        >
          <LayoutDashboard className="w-5 h-5" />
          Admin Dashboard
        </Link>
      )}

      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href || (link.href !== '/account' && pathname.startsWith(link.href))
        
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-b border-border last:border-0 ${
              isActive 
                ? 'bg-primary/5 text-primary border-l-4 border-l-primary pl-5' 
                : 'text-text hover:bg-surface-dark hover:text-primary border-l-4 border-l-transparent pl-5'
            }`}
          >
            <Icon className="w-5 h-5" />
            {link.name}
          </Link>
        )
      })}
      
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-l-4 border-l-transparent pl-5 w-full text-left"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  )
}
