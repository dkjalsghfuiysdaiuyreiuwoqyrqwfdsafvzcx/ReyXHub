import { getSession } from "@/lib/actions/auth-actions"
import { redirect } from "next/navigation"
import DBTitle from "./db-title"
import StatCard from "../card/StatCard"
import { Copy } from "lucide-react"
import { getUserApiKey } from "@/lib/actions/api-key"

export default async function Dashboard() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }
  const apiKey = await getUserApiKey(session?.user.id)


  return (
    <div className="mt-10 bg-[#ffffff]/80 p-4 border border-slate-200 rounded-2xl shadow grid grid-cols-2">
      <div className="col-span-2">
        <DBTitle
          title="Dashboard"
          description="See the statistics of your Farm."
        />
      </div>

      <div className="col-span-2 md:col-span-2">
        <div className="mt-4 border border-slate-200 p-4 rounded-lg flex items-center gap-2">
          <h1 className="font-semibold">API Key: {apiKey[0].key}</h1>
          <Copy size={15} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-10 col-span-2">
        <div className="col-span-2 md:col-span-1">
          <StatCard title="Time" firstNum={999} secondNum={999} buttonName="Add Time" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <StatCard title="Accounts" firstNum={999} secondNum={999} buttonName="Add Accounts" />
        </div>
      </div>

      <div>

      </div>
    </div>
  )
}