"use server";

import { db } from "@/db/drizzle";
import { users } from "@/db/schemas/usersSchema";
import { registerSchema } from "@/validation";
import { hash } from "bcryptjs";
import { z } from "zod";

export async function registerUser({
  email,
  password,
  passwordConfirm,
}: z.infer<typeof registerSchema>) {
  // validate the user inputs
  const userValidation = registerSchema.safeParse({
    email,
    password,
    passwordConfirm,
  });
  if (!userValidation.success) {
    return {
      error: true,
      message: userValidation.error.issues[0].message ?? "An error occurred.",
    };
  }

  try {
    // Hash the password
    const hashedPassword = await hash(password, 10);
    await db.insert(users).values({
      email,
      password: hashedPassword,
    });
  } catch (err: any) {
    if (err.code === "23505") {
      return {
        error: true,
        message: "An account is already registered with that email address.",
      };
    }

    return {
      error: true,
      message: "An error occurred." + err.message,
    };
  }
}
