import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const COUNTER_KEY = 'questionCount';

// Fallback in-memory counter in case KV isn't available
let fallbackCounter = 30; // Start with 30 for previously answered questions

// Helper to check if KV is properly configured
const isKvConfigured = () => {
  return process.env.KV_URL && process.env.KV_REST_API_TOKEN;
};

// Get current count
export async function GET() {
  try {
    // Use KV if configured, otherwise use fallback
    if (isKvConfigured()) {
      // Try to get count from KV storage
      let count = await kv.get<number>(COUNTER_KEY);
      
      // If it doesn't exist yet, initialize it with 30 previous answers
      if (count === null) {
        count = 30;
        await kv.set(COUNTER_KEY, count);
      }
      
      return NextResponse.json({ count });
    } else {
      // Use in-memory fallback if KV isn't configured
      console.log('Using fallback counter: KV not configured');
      return NextResponse.json({ count: fallbackCounter });
    }
  } catch (error) {
    console.error('Error reading question count:', error);
    
    // Fallback to in-memory counter if KV fails
    return NextResponse.json({ count: fallbackCounter });
  }
}

// Increment count
export async function POST() {
  try {
    if (isKvConfigured()) {
      // Try to get the current count from KV
      let count = await kv.get<number>(COUNTER_KEY);
      
      // Initialize if needed with 30 previous answers
      if (count === null) {
        count = 30;
      }
      
      // Increment by 2 (one for each perspective)
      count += 2;
      
      // Save back to KV
      await kv.set(COUNTER_KEY, count);
      
      return NextResponse.json({ count });
    } else {
      // Use in-memory fallback if KV isn't configured
      console.log('Using fallback counter: KV not configured');
      fallbackCounter += 2;
      return NextResponse.json({ count: fallbackCounter });
    }
  } catch (error) {
    console.error('Error incrementing question count:', error);
    
    // Fall back to incrementing the in-memory counter
    fallbackCounter += 2;
    return NextResponse.json({ count: fallbackCounter });
  }
} 