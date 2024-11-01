import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, { message: "The title must be at least 3 characters." }),
  description: z.string(),
});
