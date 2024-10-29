import { db } from "@/db/drizzle";
import { users } from "@/db/schemas/usersSchema";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authenticator } from "otplib";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        token: {},
      },
      async authorize(credentials) {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));
        if (!user) {
          throw new Error("Incorrect credentials.");
        } else {
          const passwordMatch = await compare(
            credentials.password as string,
            user.password!
          );

          if (!passwordMatch) {
            throw new Error("Incorrect credentials.");
          }

          // OTP logic here
          if (user.twoFactorActivated) {
            // check the validity of the token
            const tokenValid = authenticator.check(
              credentials.token as string,
              user.twoFactorSecret!
            );
            if (!tokenValid) {
              throw new Error("Incorrect OTP.");
            }
          }
        }

        return {
          // This object is for jwt
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;

      return session;
    },
  },
});
