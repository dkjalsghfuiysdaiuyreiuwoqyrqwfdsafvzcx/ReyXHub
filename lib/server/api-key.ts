import "server-only"
import prisma from "../prisma"

export async function validateUserApiKey(userId: string) {
  const apiKey = await prisma.apiKey.findFirst({
    where: {
      userId,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  if (!apiKey) {
    return {
      ok: false,
      message: "No active API key found",
      apiKey: null,
    }
  }

  if (!apiKey.expiresAt) {
    return {
      ok: false,
      message: "API key has no expiration",
      apiKey: null,
    }
  }

  const now = new Date()

  if (now > apiKey.expiresAt) {
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: {
        isActive: false,
      },
    })

    return {
      ok: false,
      message: "API key expired",
      apiKey: null,
    }
  }

  return {
    ok: true,
    message: "API key is valid",
    apiKey,
  }
}