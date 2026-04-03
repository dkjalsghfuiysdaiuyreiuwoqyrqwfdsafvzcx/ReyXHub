
import { Badge } from "../ui/badge";
import { redirect } from "next/navigation";
import { getSession, logoutEmail } from "@/lib/actions/auth-actions";


export default async function WelcomeMsg(){

    const session = await getSession()
    if (!session){
        logoutEmail()
        redirect("/login")
    }
    const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
    return(
        <div className="mt-10">
            <h1 className="font-bold">Welcome, {session.user.name}</h1>
            <p className={session.user.role === "PREMIUM" ? "font-bold text-yellow-400" : "font-bold text-gray-500"}>{session.user.role}</p>
            <p>{today}</p>
        </div>
    )
}