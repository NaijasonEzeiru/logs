import { db } from "@/db/db";
import { victimsTable } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export const DELETE = async (request: Request) => {
  const session = await getSession(); // Ensure user is authenticated before allowing delete operation
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { id } = await request.json();
    const result = await db
      .delete(victimsTable)
      .where(eq(victimsTable.id, id))
      .returning();

    console.log({ deleteResult: result });
    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Victim not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Victim deleted successfully" }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error handling DELETE request:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
