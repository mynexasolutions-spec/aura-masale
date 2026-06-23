import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

/**
 * POST /api/admin/seed
 *
 * Seeds the admin account if it doesn't already exist.
 * Uses the ADMIN_EMAIL and ADMIN_PASSWORD environment variables.
 * This endpoint should be called once during initial setup.
 *
 * Security: Uses the Supabase service role key (server-side only).
 */
export async function POST() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: 'ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required' },
        { status: 500 }
      )
    }

    const supabase = createAdminClient()

    // Check if admin profile already exists
    const { data: existingAdmin } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .single()

    if (existingAdmin) {
      return NextResponse.json({
        message: 'Admin account already exists',
        seeded: false,
      })
    }

    // Create the admin user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        full_name: 'Admin',
        phone: '',
        role: 'admin',
      },
    })

    if (authError) {
      // If user already exists in auth but not in profiles, handle gracefully
      if (authError.message?.includes('already been registered')) {
        return NextResponse.json({
          message: 'Admin auth user already exists. Profile may need manual setup.',
          seeded: false,
        })
      }
      throw authError
    }

    return NextResponse.json({
      message: 'Admin account created successfully',
      seeded: true,
      adminId: authData.user.id,
    })
  } catch (error) {
    console.error('Admin seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed admin account', details: String(error) },
      { status: 500 }
    )
  }
}
