import { NextResponse } from "next/server";
import Analytics from "@/lib/analytics";
import returnErrorResponse from "@/lib/error";

export const GET = async () => {

  const analytics = new Analytics()
  try {
    const responseCount = await analytics.getResponseCount();
    const requestCount = await  analytics.getRequestCount();

    return NextResponse.json({
      requestCount,
      responseCount,
    });
  } catch (error: any) {
    return returnErrorResponse(error);
  }
}
