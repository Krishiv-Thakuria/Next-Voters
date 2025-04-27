import { NextRequest, NextResponse } from 'next/server';

// Use a global variable to store count
// This will reset on server restart but is safer for deployment
let globalCount = 0;

// Get current count
export async function GET() {
  try {
    return NextResponse.json({ count: globalCount });
  } catch (error) {
    console.error('Error reading question count:', error);
    return NextResponse.json({ count: 0 });
  }
}

// Increment count
export async function POST() {
  try {
    // Increment by 2 (one for each perspective)
    globalCount += 2;
    return NextResponse.json({ count: globalCount });
  } catch (error) {
    console.error('Error incrementing question count:', error);
    return NextResponse.json({ error: 'Failed to increment count' }, { status: 500 });
  }
} 