import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email").unique(),
  password: varchar("password"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
  twoFactorActivated: boolean("2fa_activated").default(false),
  twoFactorSecret: varchar("2fa_secret"),
});
