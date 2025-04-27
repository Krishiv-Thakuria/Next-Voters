import { NextResponse } from 'next/server';
import { reprocessDocuments } from '../../utils/documentProcessor';

export const runtime = 'nodejs';

export async function GET() {
  console.log('Reprocess API route called');
  
  try {
    await reprocessDocuments();
    
    return NextResponse.json({ 
      message: "Documents reprocessed successfully",
      success: true 
    }, { status: 200 });
  } catch (error) {
    console.error("Document reprocessing error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    }, { status: 500 });
  }
} 