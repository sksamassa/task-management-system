import { string, z } from "zod";
import { passwordSchema } from "./passwordSchema";

export const passwordMatchSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirm"],
        message: "Passwords do not match.",
      });
    }
  });
