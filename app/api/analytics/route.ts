import { NextResponse } from "next/server";
import { handleGetRequestCount, handleGetResponseCount } from "@/lib/analytics";

export async function GET() {
  try {
    const responseCount = await handleGetResponseCount();
    const requestCount = await handleGetRequestCount();

    return NextResponse.json({
      requestCount,
      responseCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
