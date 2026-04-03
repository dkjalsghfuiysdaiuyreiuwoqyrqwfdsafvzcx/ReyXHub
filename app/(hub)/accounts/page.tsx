import { getAccountsLinked } from "@/lib/actions/accounts/accounts-actions"
import { getUserApiKey } from "@/lib/actions/api-key"
import { formatTimeAgo } from "@/lib/format/format-time-ago"
import {
  Users,
  FlaskConical,
  DollarSign,
  Star,
  Ticket,
  Egg,
  Search,
  Filter,
  Columns3,
  Download,
  TerminalSquare,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"


const topStats = [
  {
    title: "Online / Total Accounts",
    value: "161",
    subValue: "/ 211",
    icon: Users,
    valueClass: "text-green-600",
  },
  {
    title: "Potions",
    value: "35,259",
    icon: FlaskConical,
    valueClass: "text-yellow-600",
  },
  {
    title: "Bucks",
    value: "37.53M",
    icon: DollarSign,
    valueClass: "text-green-600",
  },
  {
    title: "Event Currency",
    value: "652.67M",
    icon: Star,
    valueClass: "text-red-500",
  },
  {
    title: "Tickets",
    value: "2,000",
    icon: Ticket,
    valueClass: "text-orange-500",
  },
  {
    title: "Crystal Eggs",
    value: "0",
    icon: Egg,
    valueClass: "text-sky-500",
  },
]

const statChanges = [
  { title: "Bucks", value: "+137.1k", color: "text-green-600" },
  { title: "Pet Count", value: "+0", color: "text-orange-500" },
  { title: "Potions", value: "+198", color: "text-violet-600" },
  { title: "Event Currency", value: "+3.8M", color: "text-pink-600" },
  { title: "Tickets", value: "+0", color: "text-sky-600" },
  { title: "Crystal Eggs", value: "+0", color: "text-cyan-600" },
]


function StatCard({
  title,
  value,
  subValue,
  icon: Icon,
  valueClass,
}: {
  title: string
  value: string
  subValue?: string
  icon: React.ElementType
  valueClass: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {title}
          </p>
          <div className="mt-3 flex items-end gap-1">
            <span className={`text-3xl font-bold ${valueClass}`}>{value}</span>
            {subValue && (
              <span className="pb-1 text-sm font-medium text-slate-500">
                {subValue}
              </span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-3 text-slate-500">
          <Icon size={18} />
        </div>
      </div>
    </div>
  )
}

function ChangeCard({
  title,
  value,
  color,
}: {
  title: string
  value: string
  color: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {title}
      </p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

export default async function AccountsPage() {

  const apiKey = await getUserApiKey()
  const accounts = await getAccountsLinked(apiKey[0].id)
  const accountsWithStatus = accounts.map((account) => {
    const FIVE_MINUTES = 5 * 60 * 1000;

    let computedStatus = "OFFLINE";

    if (account.lastSeen) {
      const diff = Date.now() - new Date(account.lastSeen).getTime();
      computedStatus = diff <= FIVE_MINUTES ? "ONLINE" : "OFFLINE";
    }

    return {
      ...account,
      status: computedStatus,
    };
  });
  return (
    <div className="mt-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Accounts
        </h1>
        <p className="mt-1 text-slate-600">
          Manage and monitor your Adopt Me accounts
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {topStats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Statistics</h2>
            <p className="text-sm text-slate-500">
              Overview of changes in your accounts
            </p>
          </div>

          <div className="flex items-center rounded-xl border border-slate-200 p-1 text-sm">
            <button className="rounded-lg px-3 py-1.5 font-medium text-slate-900">
              1h
            </button>
            <button className="rounded-lg px-3 py-1.5 text-slate-500">
              24h
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {statChanges.map((item) => (
            <ChangeCard key={item.title} {...item} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search accounts..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-slate-200 p-1 text-sm">
              <button className="rounded-lg px-4 py-2 font-medium text-slate-900">
                All
              </button>
              <button className="rounded-lg px-4 py-2 text-slate-500">
                Online
              </button>
              <button className="rounded-lg px-4 py-2 text-slate-500">
                Offline
              </button>
            </div>

            <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300">
              <Filter size={16} />
              Filters
            </button>

            <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300">
              <Columns3 size={16} />
              Columns
            </button>

            <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300">
              <Download size={16} />
              Export
            </button>

            <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-violet-200 px-4 text-sm font-medium text-violet-700 transition hover:border-violet-300">
              <TerminalSquare size={16} />
              Commands
            </button>

            <button className="h-11 rounded-xl border border-red-200 px-4 text-sm font-medium text-red-600 transition hover:border-red-300">
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <select className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none">
              <option>100 per page</option>
              <option>50 per page</option>
              <option>25 per page</option>
            </select>

            <p className="text-sm text-slate-600">1 of 3 pages (211 total)</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-slate-200 p-2 text-slate-500">
              <ChevronsLeft size={16} />
            </button>
            <button className="rounded-xl border border-slate-200 p-2 text-slate-500">
              <ChevronLeft size={16} />
            </button>
            <button className="rounded-xl border border-slate-300 p-2 text-slate-900">
              <ChevronRight size={16} />
            </button>
            <button className="rounded-xl border border-slate-200 p-2 text-slate-500">
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
                <th className="px-4 py-4">
                  <input type="checkbox" />
                </th>
                <th className="px-4 py-4">Account</th>
                <th className="px-4 py-4">Device</th>
                <th className="px-4 py-4">Potions</th>
                <th className="px-4 py-4">Bucks</th>
                <th className="px-4 py-4">Event Currency</th>
                <th className="px-4 py-4">Tickets</th>
                <th className="px-4 py-4">Last Seen</th>
                <th className="px-4 py-4">Pets</th>
                <th className="px-4 py-4">Session</th>
              </tr>
            </thead>

            <tbody>
              {accountsWithStatus.map((account) => (
                <tr
                  key={account.account}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className="px-4 py-4">
                    <input type="checkbox" />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          account.status == "ONLINE"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="font-medium text-slate-900">
                        {account.account}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-slate-700">{account.device}</td>
                  <td className="px-4 py-4 font-medium text-slate-900">
                    {account.potions}
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-900">
                    {account.bucks}
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-900">
                    {account.eventCurrency}
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-900">
                    {account.tickets}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {formatTimeAgo(account.lastSeen)}
                  </td>

                  <td className="px-4 py-4">
                    <button className="rounded-lg border border-sky-200 px-3 py-1.5 text-sm font-medium text-sky-700 hover:border-sky-300">
                      View Pets
                    </button>
                  </td>

                  <td className="px-4 py-4">
                    <button className="rounded-lg border border-violet-200 px-3 py-1.5 text-sm font-medium text-violet-700 hover:border-violet-300">
                      Session
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}