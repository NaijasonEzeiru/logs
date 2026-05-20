import { UserWithRelations } from "@/db/schema";
import { loginSchema } from "@/lib/zodSchema";
import z from "zod";

export async function getCurrentUser(): Promise<UserWithRelations | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null; // not logged in
  const data = await res.json();
  return data?.user || null;
}

export async function loginUser({
  username,
  password,
}: z.infer<typeof loginSchema>): Promise<{
  messsage: string;
  data: UserWithRelations;
}> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.log({ errorData });
    throw (
      errorData || {
        message: "Login failed",
      }
    );
  }
  const response = await res.json();
  return response;
}
