import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to our counter file
const COUNTER_FILE = path.join(process.cwd(), 'question-count.txt');

// Initialize counter file if it doesn't exist
if (!fs.existsSync(COUNTER_FILE)) {
  fs.writeFileSync(COUNTER_FILE, '0', 'utf8');
}

// Get current count
export async function GET() {
  try {
    const count = fs.readFileSync(COUNTER_FILE, 'utf8');
    return NextResponse.json({ count: parseInt(count, 10) });
  } catch (error) {
    console.error('Error reading question count:', error);
    return NextResponse.json({ count: 0 });
  }
}

// Increment count - now by 2 to count both perspectives
export async function POST() {
  try {
    // Read current count
    const currentCount = fs.readFileSync(COUNTER_FILE, 'utf8');
    // Increment by 2 (one for each perspective)
    const newCount = parseInt(currentCount, 10) + 2;
    // Write back to file
    fs.writeFileSync(COUNTER_FILE, newCount.toString(), 'utf8');
    return NextResponse.json({ count: newCount });
  } catch (error) {
    console.error('Error incrementing question count:', error);
    return NextResponse.json({ error: 'Failed to increment count' }, { status: 500 });
  }
} 