import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from './_components/ProfileForm'

export const metadata = {
  title: 'My Profile | Aura Masale',
}

export default async function AccountProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="bg-white rounded-2xl border border-border p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-text mb-6">Profile Settings</h1>
      
      <div className="max-w-xl">
        <ProfileForm 
          initialFullName={profile?.full_name || ''} 
          initialPhone={profile?.phone || ''}
          email={profile?.email || user.email || ''} 
        />
      </div>
    </div>
  )
}
