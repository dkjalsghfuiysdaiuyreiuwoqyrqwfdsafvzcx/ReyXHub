"use server"

import { headers } from "next/headers"
import { auth } from "../auth"
import { cache } from "react"


export async function registerEmail(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm-password") as string
    const name = formData.get("name") as string

    await auth.api.signUpEmail({
        body: {
            name,
            email,
            password
        },
        headers: await headers()
    })
}

export async function loginEmail(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    await auth.api.signInEmail({
        body: {
            email,
            password
        },
        headers: await headers()
    })
}

export async function logoutEmail() {
    await auth.api.signOut({
        headers: await headers()
    })
}

export const getSession = cache(async () => {
  const result = await auth.api.getSession({
    headers: await headers(),
  });

  return result
})