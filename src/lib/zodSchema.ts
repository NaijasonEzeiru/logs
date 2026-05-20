import z from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    // 1️⃣ Length
    .min(4, { message: "Must be at least 4 characters" })
    .max(40, { message: "Must be at most 40 characters" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(30, "Password must be at most 30 characters."),
});
