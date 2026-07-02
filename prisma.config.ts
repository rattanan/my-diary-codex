import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: process.env.DATABASE_URL
    ? {
        url: env("DATABASE_URL"),
      }
    : undefined,
});
