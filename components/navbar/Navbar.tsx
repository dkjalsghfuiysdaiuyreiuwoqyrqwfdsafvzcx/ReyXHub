import { Button } from "../ui/button";


export default function Navbar() {
    return (
        <div className="sticky top-0 z-50 flex items-center justify-around py-4 px-4 md:px-40 shadow bg-white/70 backdrop-blur">
            <div>
                <h1 className="font-bold text-xl">ReyX</h1>
            </div>
            <div>
                <ul className="hidden md:flex items-center gap-4">
                    <li className="font-bold cursor-pointer">
                        <a href="#home">Home</a>
                    </li>
                    <li className="cursor-pointer">
                        <a href="#pricing">Pricing</a>
                    </li>
                    <li className="cursor-pointer">
                        <a href="#other-games">Other Games</a>
                    </li>
                </ul>
            </div>
            <div className="flex gap-4">
                <div className="cursor-pointer">
                    <img width="30" height="30" src="https://img.icons8.com/color/48/discord-logo.png" alt="discord-logo" />
                </div>
                <div className="flex gap-4">
                    <Button>Login</Button>
                    <Button variant={"outline"}>Register</Button>
                </div>
            </div>
        </div>
    )
}