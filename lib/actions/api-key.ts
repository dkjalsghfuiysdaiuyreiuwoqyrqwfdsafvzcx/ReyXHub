import { redirect } from "next/navigation"
import { getSession, logoutEmail } from "./auth-actions"
import prisma from "../prisma"
import crypto from "crypto";

type GenerateApiKeyParams = {
  userId: string;
  maxRequests?: number;
  expiresAt?: Date | null;
};


export async function getUserApiKey(userId: string) {

    const session = await getSession()
    if (!session) {
        logoutEmail()
        redirect("/login")
    }

    const userApiKey = await prisma.apiKey.findMany({
        where: {
            userId: userId
        }
    })

    return userApiKey
}

export async function generateApiKey({
  userId,
  maxRequests = 1000,
  expiresAt = null,
}: GenerateApiKeyParams) {
  // 🔑 generate secure key
  const key = crypto.randomBytes(32).toString("hex");

  const apiKey = await prisma.apiKey.create({
    data: {
      key,
      maxRequests,
      expiresAt,
      userId,
    },
  });

  return apiKey;
}
