import { NextResponse } from 'next/server';

export async function GET() {
  // Check environment variables without revealing full values
  const voyageKey = process.env.VOYAGE_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  
  return NextResponse.json({
    voyage: {
      exists: !!voyageKey,
      length: voyageKey?.length || 0,
      prefix: voyageKey?.substring(0, 5) + '...',
      value: voyageKey === 'voyage-api-key-goes-here-without-quotes' ? 'Using placeholder!' : 'Not using placeholder'
    },
    anthropic: {
      exists: !!anthropicKey,
      length: anthropicKey?.length || 0,
      prefix: anthropicKey?.substring(0, 10) + '...'
    }
  });
} 