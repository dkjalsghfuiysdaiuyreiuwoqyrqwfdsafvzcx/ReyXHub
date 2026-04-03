import Dashboard from "@/components/dashboard/dashboard";
import WelcomeMsg from "@/components/dashboard/welcome-msg";
import { getSession, logoutEmail } from "@/lib/actions/auth-actions";
import { redirect } from "next/navigation";


export default async function Hub() {
    const session = await getSession()
    if (!session) {
        logoutEmail()
        redirect("/login")
    }
    return (
        <div className="">
            <WelcomeMsg />
            <Dashboard />
        </div>
    )
}