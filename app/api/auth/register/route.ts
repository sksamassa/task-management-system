import { db } from "@/db/drizzle";
import { users } from "@/db/schemas/usersSchema";
import { emailSchema, passwordSchema } from "@/validation";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const userSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export async function POST(req: NextRequest) {
  try {
    // Validate the inputs data
    const { email, password } = await req.json();
    const newUserValidation = userSchema.safeParse({
      email,
      password,
    });
    if (!newUserValidation.success) {
      return NextResponse.json(
        {
          message:
            newUserValidation?.error?.issues[0]?.message ??
            "An error occurred.",
        },
        { status: 400 }
      );
    }

    // Check if the user already exisets
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (user) {
      return NextResponse.json(
        { message: "The user already exists." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Insert the user into the db
    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
      })
      .returning({
        userId: users.id,
        email: users.email,
      });

    return NextResponse.json(
      { message: "The user is registered successfully.", user: newUser },
      { status: 201 }
    );
  } catch (err) {
    if ((err as { code: string}).code === "23505") {
      return NextResponse.json(
        { message: "An account is already register with that email address." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to register the user." },
      { status: 500 }
    );
  }
}
