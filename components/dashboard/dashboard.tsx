import { getSession } from "@/lib/actions/auth-actions"
import { redirect } from "next/navigation"
import DBTitle from "./db-title"
import StatCard from "../card/StatCard"
import { getUserApiKey, generateApiKey } from "@/lib/actions/api-key"
import { revalidatePath } from "next/cache"
import { validateUserApiKey } from "@/lib/server/api-key"
import ApiKeyCard from "./ApiKeyCard"

export default async function Dashboard() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  const apiKey = await getUserApiKey(session.user.id)
  const hasApiKey = apiKey.length > 0

  async function handleGenerateApiKey() {
    "use server"

    const session = await getSession()
    if (!session) {
      redirect("/login")
    }

    const existingKey = await getUserApiKey(session.user.id)

    if (existingKey.length === 0) {
      await generateApiKey({
        userId: session.user.id,
        maxRequests: 1,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
    }

    revalidatePath("/dashboard")
  }

  const validation = await validateUserApiKey(session.user.id)

  let remainingHours = 0
  let remainingMinutes = 0

  if (validation.ok && validation.apiKey?.expiresAt) {
    const now = new Date()
    const expiresAt = new Date(validation.apiKey.expiresAt)
    const remainingMs = Math.max(0, expiresAt.getTime() - now.getTime())

    remainingHours = Math.floor(remainingMs / (1000 * 60 * 60))
    remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60))
  }

  return (
    <div className="mt-10 bg-[#ffffff]/80 p-4 border border-slate-200 rounded-2xl shadow grid grid-cols-2">
      <div className="col-span-2">
        <DBTitle
          title="Dashboard"
          description="See the statistics of your Farm."
        />
      </div>

      <div className="col-span-2 md:col-span-2">
        {hasApiKey ? (
          <ApiKeyCard apiKey={apiKey[0].key} />
        ) : (
          <form action={handleGenerateApiKey} className="mt-4">
            <button
              type="submit"
              className="border border-slate-200 px-4 py-2 rounded-lg font-semibold hover:bg-slate-100 transition"
            >
              Generate API Key
            </button>
          </form>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-10 col-span-2">
        <div className="col-span-2 md:col-span-1">
          <div className="border border-slate-200 rounded-xl p-6 h-full flex flex-col justify-between">
            <h2 className="text-lg font-semibold">Time</h2>

            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <h1 className="text-5xl font-light">
                {remainingHours}
                <span className="mx-2 text-slate-400">h</span>
                {remainingMinutes}
                <span className="ml-2 text-slate-400">m</span>
              </h1>
              <p className="mt-2 text-slate-500">remaining</p>
            </div>

            <div className="flex justify-end">
              <button className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                Add Time
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1">
          <StatCard
            title="Accounts"
            firstNum={999}
            secondNum={999}
            buttonName="Add Accounts"
          />
        </div>
      </div>
    </div>
  )
}