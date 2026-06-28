'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export type AuthResult = {
  error?: string
  success?: boolean
}

async function mergeGuestCart(userId: string) {
  const cookieStore = await cookies()
  const guestCartCookie = cookieStore.get('guest_cart')
  if (!guestCartCookie) return

  try {
    const guestCart = JSON.parse(guestCartCookie.value) as { variant_id: string, quantity: number }[]
    if (!guestCart || guestCart.length === 0) return

    const supabase = await createClient()

    for (const item of guestCart) {
      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', userId)
        .eq('variant_id', item.variant_id)
        .single()

      if (existing) {
        await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + item.quantity })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('cart_items')
          .insert([{ user_id: userId, variant_id: item.variant_id, quantity: item.quantity }])
      }
    }

    // Clear the guest cart
    cookieStore.delete('guest_cart')
  } catch (err) {
    console.error('Failed to merge guest cart', err)
  }
}

export async function sendOtp(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email is required' }
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      data: {
        role: 'customer'
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function verifyOtp(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const token = formData.get('token') as string

  if (!email || !token) {
    return { error: 'Email and OTP are required' }
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    await mergeGuestCart(data.user.id)
  }

  const redirectTo = formData.get('redirectTo') as string || '/'

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function adminLogin(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Verify this user is actually an admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    await supabase.auth.signOut()
    return { error: 'You do not have admin access' }
  }

  revalidatePath('/admin', 'layout')
  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
