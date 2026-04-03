import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import prisma from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { ROLE } from "@/app/generated/prisma/enums";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {type: ["STARTER", "PREMIUM"], required: true, defaultValue: "STARTER", input: false}
        }
    },
    plugins: [
        nextCookies(),
    ]
});