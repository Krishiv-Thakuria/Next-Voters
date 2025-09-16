import { generateResponses, searchEmbeddings } from "@/lib/ai";
import { NextRequest } from "next/server"

export const POST = async (request: NextRequest) => {
  return Response.json({
    health: "ok"
  })
}
