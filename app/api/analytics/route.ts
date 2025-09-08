import { handleGetRequestCount, handleGetResponseCount } from "@/lib/analytics";

export async function GET() {
  try {    
    const responseCount = await handleGetResponseCount();
    const requestCount = await handleGetRequestCount();
    
    return Response.json({
      requestCount,
      responseCount
    });
  } catch (error) {
    console.log(error.message)
    return Response.json(
      { error: error.message},
      { status: 500 }
    );
  }
}