import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Missing email parameter.' }, { status: 400 })
  }

  try {
    await db
      .deleteFrom('email_subscriptions')
      .where('email', '=', email)
      .execute()

    return NextResponse.json({
      message: 'You have been unsubscribed from Civic Line.',
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Database error.' },
      { status: 500 }
    )
  }
}
