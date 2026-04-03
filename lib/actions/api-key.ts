import { redirect } from "next/navigation"
import { getSession, logoutEmail } from "./auth-actions"
import prisma from "../prisma"


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