import { db } from "@/lib/database";

export async function GET() {
  try {
    // Get all chats from the database
    const chats = await db
      .selectFrom("chats")
      .selectAll()
      .execute();
    
    // Get the count of all chats
    const chatCount = await db
      .selectFrom("chats")
      .select(db => db.fn.count('id').as('total'))
      .executeTakeFirst();
    
    return Response.json({
      chats,
      totalChats: chatCount?.total || 0
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return Response.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}