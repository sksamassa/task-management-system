import { z } from "zod";
import { passwordSchema } from "./passwordSchema";
import { passwordMatchSchema } from "./passwordMatchSchema";

export const changePasswordSchema = z.object({
    currentPassword: passwordSchema,
}).and(passwordMatchSchema)