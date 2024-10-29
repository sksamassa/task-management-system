"use server";

import { db } from "@/db/drizzle";
import { passwordResetTokens } from "@/db/schemas/passwordResetTokensSchema";
import { users } from "@/db/schemas/usersSchema";
import { auth } from "@/lib/auth";
import { passwordMatchSchema } from "@/validation";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

interface UpdatePasswordProps {
  password: string;
  passwordConfirm: string;
  token: string;
}

export async function updatePassword({
  password,
  passwordConfirm,
  token,
}: UpdatePasswordProps) {
  // validate inputs data
  const validation = passwordMatchSchema.safeParse({
    password,
    passwordConfirm,
  });
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message ?? "An error occurred.",
    };
  }

  // Check whethere the user is logged in
  const session = await auth();
  if (session?.user?.id) {
    return {
      error: true,
      message: "Logged out to reset your password.",
    };
  }

  // check the validity of the token
  let tokenIsValid = false;
  if (token) {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    const now = Date.now();

    if (
      !!passwordResetToken.token &&
      now < passwordResetToken.tokenExpiry?.getTime()!
    ) {
      tokenIsValid = true;
    }

    if (!tokenIsValid) {
        return {
            error: true,
            message: "The password reset token is invalid or has expired.",
            tokenInvalid: true
        }
    }

    // update the password
    const hashedPassword = await hash(password, 10);
    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, passwordResetToken.userId as string));

    // delete token after updating
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, passwordResetToken.id));
  }
}
