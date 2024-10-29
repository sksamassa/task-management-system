"use server";

import { db } from "@/db/drizzle";
import { users } from "@/db/schemas/usersSchema";
import { auth } from "@/lib/auth";
import { changePasswordSchema } from "@/validation";
import { compare } from "bcryptjs";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function changePassword({
  currentPassword,
  password,
  passwordConfirm,
}: z.infer<typeof changePasswordSchema>) {
  // Ensure the user is logged in
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: true,
      message: "You must be logged in to change your password.",
    };
  }

  const validation = changePasswordSchema.safeParse({
    currentPassword,
    password,
    passwordConfirm,
  });
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message ?? "An error occurred.",
    };
  }

  try {
    // retrieve the user from db
    // compare current password with the old one
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id));
    if (!user) {
      return {
        error: true,
        message: "User not found.",
      };
    }

    const passwordMatch = await compare(
      currentPassword,
      user.password as string
    );
    if (!passwordMatch) {
      return {
        error: true,
        message: "The current password is incorrect.",
      };
    }

    // hash the current password and update
    const hashedPassword = await hash(password, 10);

    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, session.user.id));
  } catch (err: any) {
    return {
      error: true,
      messagea: "An error occurred.",
    };
  }
}
