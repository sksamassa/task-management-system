import "dotenv/config";
import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: ".env" });
export default defineConfig({
  schema: "./db/schemas/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL!,
  },
});
