import Dashboard from "@/components/dashboard/dashboard";
import WelcomeMsg from "@/components/dashboard/welcome-msg";


export default function Hub() {

    return (
        <div className="h-screen">
            <WelcomeMsg />
            <Dashboard />
        </div>
    )
}