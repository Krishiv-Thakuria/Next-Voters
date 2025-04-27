import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Root API route GET called');
  return NextResponse.json({
    message: "Welcome to the Canadian Political Perspectives API. Please use the appropriate endpoints with POST method.",
    endpoints: {
      conservative: "/api/conservative",
      liberal: "/api/liberal"
    },
    success: true
  }, { status: 200 });
}

export async function POST() {
  console.log('Root API route POST called');
  return NextResponse.json({
    message: "Please use one of the specific party endpoints with POST method.",
    endpoints: {
      conservative: "/api/conservative",
      liberal: "/api/liberal"
    },
    success: true
  }, { status: 200 });
}

// Handle all other HTTP methods
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

export async function PUT() {
  return NextResponse.json({ 
    error: "Method not allowed. Please use GET or POST.", 
    success: false 
  }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ 
    error: "Method not allowed. Please use GET or POST.", 
    success: false 
  }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ 
    error: "Method not allowed. Please use GET or POST.", 
    success: false 
  }, { status: 405 });
} 