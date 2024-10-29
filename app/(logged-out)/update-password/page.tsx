import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { db } from "@/db/drizzle";
import { passwordResetTokens } from "@/db/schemas/passwordResetTokensSchema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import PasswordUpdateForm from "@/components/password-upadate-form";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const { token } = searchParams;
  let tokenIsValid = false;
  if (token) {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    const now = Date.now();

    if (
      passwordResetToken?.token && // Ensures passwordResetToken and token exist
      passwordResetToken.tokenExpiry && // Ensures tokenExpiry exists
      now < passwordResetToken.tokenExpiry.getTime()
    ) {
      tokenIsValid = true;
    }
  }

  return (
    <main>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-semibold">
            {tokenIsValid
              ? "Reset password"
              : "Your password reset token is invalid or has expired."}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tokenIsValid ? (
            <PasswordUpdateForm token={token!} />
          ) : (
            <div>
              <Link href="/reset-password" className="underline">
                Request another password reset link.
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
