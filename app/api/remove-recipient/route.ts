import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = body.email

    if (!email) {
      return NextResponse.json(
        { error: 'Missing email parameter.' },
        { status: 400 }
      )
    }

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
