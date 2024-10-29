import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(5, "The password must be at least 5 characters.");
