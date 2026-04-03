"use server"

import { getSession } from "@/lib/actions/auth-actions"
import { redirect } from "next/navigation"
import { validateUserApiKey } from "@/lib/server/api-key"

export async function doProtectedThing() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const validation = await validateUserApiKey(session.user.id)

  if (!validation.ok) {
    throw new Error(validation.message)
  }

  // safe to continue here
  return {
    success: true,
    message: "Protected action worked",
  }
}