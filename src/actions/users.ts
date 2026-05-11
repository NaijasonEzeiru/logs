"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { usersTable } from "../db/schema";
import { db } from "../db/db";
import { hashData } from "@/lib/crypto";
import { eq } from "drizzle-orm";
import { createSession } from "@/lib/auth";

// Validation schema
const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(50, "Username must be at most 50 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    )
    .trim(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type FormState = {
  errors?: {
    username?: string[];
    password?: string[];
    _form?: string[];
  };
  success?: boolean;
  data?: {
    username?: string;
  };
};

// This is the server action that will be bound with the state
export async function createUser(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // Extract data from form
  const rawData = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  // Validate the data
  const result = userSchema.safeParse(rawData);

  if (!result.success) {
    // Return validation errors
    return {
      errors: result.error.flatten().fieldErrors,
      data: { username: rawData.username?.toString() || "" },
    };
  }

  const { username, password } = result.data;

  try {
    // 1. Create the user
    const [result] = await db
      .insert(usersTable)
      .values({
        passwordHash: hashData(password),
        username: username.toLowerCase(),
      })
      .returning();

    console.log("Update result:", result);

    // Revalidate the users list page if needed
    revalidatePath("/users");

    // Redirect to success page or user list
    redirect("/users?success=true");
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
      data: { username },
    };
  }
}

export async function loginUser(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // Extract data from form
  const rawData = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  // Validate the data
  const result = userSchema.safeParse(rawData);

  console.log({
    result: result.success ? result.data : result.error.flatten().fieldErrors,
  });
  if (!result.success) {
    // Return validation errors
    return {
      errors: result.error.flatten().fieldErrors,
      data: { username: rawData.username?.toString() || "" },
    };
  }

  const { username, password } = result.data;

  try {
    // 1. Find the user
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1)
      .execute();

    console.log({ user });

    if (!user) {
      return {
        errors: {
          _form: ["Invalid username or password."],
        },
        data: { username },
      };
    }
    // 2. Check the password
    const passwordHash = hashData(password);
    console.log({ passwordHash, userPasswordHash: user.passwordHash });
    if (passwordHash !== user.passwordHash) {
      return {
        errors: {
          _form: ["Invalid username or password."],
        },
        data: { username },
      };
    }

    await createSession({
      userId: user.id,
      username: user.username,
    });

    redirect("/logs");
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
      data: { username },
    };
  }
}
