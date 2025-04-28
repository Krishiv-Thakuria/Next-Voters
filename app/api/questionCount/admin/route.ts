import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const COUNTER_KEY = 'questionCount';

// Admin endpoint to set counter value
export async function POST(req: NextRequest) {
  try {
    const { value, adminKey } = await req.json();
    
    // Simple admin protection
    if (adminKey !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Validate value
    if (typeof value !== 'number' || isNaN(value) || value < 0) {
      return NextResponse.json({ error: 'Invalid value' }, { status: 400 });
    }
    
    // Set the value in KV
    if (process.env.KV_URL && process.env.KV_REST_API_TOKEN) {
      await kv.set(COUNTER_KEY, value);
      return NextResponse.json({ success: true, count: value });
    } else {
      return NextResponse.json({ error: 'KV not configured' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error setting question count:', error);
    return NextResponse.json({ error: 'Failed to set count' }, { status: 500 });
  }
} 