import { db } from "@/db/db";
import { type Victim, victimsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getVictims({
  ownerId,
}: {
  ownerId: string;
}): Promise<Victim[]> {
  try {
    // 1. Create the user
    const victims = await db
      .select()
      .from(victimsTable)
      .where(eq(victimsTable.ownerId, ownerId))
      .execute();
    return victims;
  } catch (error) {
    console.error("Error fetching victims:", error);
    return [];
  }
}
