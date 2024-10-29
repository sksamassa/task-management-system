"use server";

import { signIn } from "@/lib/auth";
import { loginSchema } from "@/validation";
import { z } from "zod";

export async function loginWithCredentials({
  email,
  password,
}: z.infer<typeof loginSchema>) {
  // Validate the inputs data
  const loginValidation = loginSchema.safeParse({
    email,
    password,
  });
  if (!loginValidation.success) {
    return {
      error: true,
      message: loginValidation.error.issues[0].message ?? "An error occurred.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (err: any) {
    return {
      error: true,
      message: "Incorrect email or password.",
    };
  }
}
