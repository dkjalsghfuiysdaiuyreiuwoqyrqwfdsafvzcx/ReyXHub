"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"

export default function HubNavbar() {
    const pathname = usePathname()

    const navItems = [
        { name: "Hub", href: "/hub" },
        { name: "Accounts", href: "/accounts" },
        { name: "Inventory", href: "/inventory" },
        { name: "Scripts", href: "/scripts" },
        { name: "Add-ons", href: "#add-ons" },
    ]

    return (
        <div className="sticky top-0 z-50 flex items-center justify-around py-4 px-4 md:px-40 shadow bg-white/70 backdrop-blur">
            <div>
                <h1 className="font-bold text-xl">ReyX</h1>
            </div>

            <ul className="hidden md:flex items-center gap-4">
                {navItems.map((item) => {
                    const isActive =
                        item.href !== "#" && pathname === item.href

                    return (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`cursor-pointer transition ${
                                    isActive
                                        ? "font-bold text-green-500"
                                        : "text-slate-700 hover:text-black"
                                }`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    )
                })}
            </ul>

            <div className="flex gap-4 items-center">
                <div className="cursor-pointer">
                    <img
                        width="30"
                        height="30"
                        src="https://img.icons8.com/color/48/discord-logo.png"
                        alt="discord-logo"
                    />
                </div>

                <Button variant={"destructive"}>Logout</Button>
            </div>
        </div>
    )
}