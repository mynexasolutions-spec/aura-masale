import { getCartCount } from '@/actions/cart'
import { NextResponse } from 'next/server'

export async function GET() {
  const count = await getCartCount()
  return NextResponse.json({ count })
}
