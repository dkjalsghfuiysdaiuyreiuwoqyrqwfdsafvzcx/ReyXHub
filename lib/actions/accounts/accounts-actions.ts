import prisma from "@/lib/prisma";


export async function getAccountsLinked(apiKeyId: string) {
    const accounts = await prisma.playerAccount.findMany({
        where: {
            apiKeyId: apiKeyId
        }
    })

    return accounts
}