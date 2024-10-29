import { z } from "zod";
import { emailSchema } from "./emailSchema";
import { passwordMatchSchema } from "./passwordMatchSchema";

export const registerSchema = z
  .object({
    email: emailSchema,
  })
  .and(passwordMatchSchema);