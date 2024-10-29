"use server";

import { db } from "@/db/drizzle";
import { passwordResetTokens } from "@/db/schemas/passwordResetTokensSchema";
import { users } from "@/db/schemas/usersSchema";
import { auth } from "@/lib/auth";
import { mailer } from "@/lib/email";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";

export async function resetPassword(emailAddress: string) {
  const session = await auth();
  if (!!session?.user?.id) {
    return {
      error: true,
      message: "You are already logged in",
    };
  }

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, emailAddress));

  if (!user) {
    return;
  }

  // create a password reset token
  // And set the token expiry for one hour
  const passwordResetToken = randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 3600000);

  // Save the password reset token to the password reset tokens table
  await db
    .insert(passwordResetTokens)
    .values({
      userId: user.id,
      token: passwordResetToken,
      tokenExpiry,
    })
    .onConflictDoUpdate({
      target: passwordResetTokens.userId,
      set: {
        token: passwordResetToken,
        tokenExpiry,
      },
    });

  // Send the email to the user
  const resetLink = `${process.env.SITE_BASE_URL}/update-password?token=${passwordResetToken}`;
  await mailer.sendMail({
    from: "test@resend.dev",
    subject: "Your password reset request",
    to: emailAddress,
    html: `Hey, ${emailAddress}! You requested to reset your password.
  <a href="${resetLink}">${resetLink}</a>`,
  });
}
