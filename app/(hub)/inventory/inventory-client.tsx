"use client"

import { useState, useMemo } from "react"
import { Search, Monitor, PawPrint, Star } from "lucide-react"
import type { DeviceWithPets } from "@/lib/actions/inventory/inventory-pets-actions"

const RARITIES = ["ALL", "LEGENDARY", "ULTRA_RARE", "RARE", "UNCOMMON", "COMMON"]

function rarityClass(rarity: string) {
    switch (rarity) {
        case "LEGENDARY": return "text-amber-600"
        case "ULTRA_RARE": return "text-rose-600"
        case "RARE": return "text-green-600"
        case "UNCOMMON": return "text-blue-300"
        case "COMMON": return "text-gray-600"
        default: return "text-slate-600"
    }
}

function rarityFilterClass(rarity: string, active: boolean) {
    if (!active) return "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
    switch (rarity) {
        case "ALL": return "border-slate-800 bg-slate-800 text-white"
        case "LEGENDARY": return "border-amber-400 bg-amber-50 text-amber-700"
        case "ULTRA_RARE": return "border-rose-400 bg-rose-50 text-rose-700"
        case "RARE": return "border-green-400 bg-green-50 text-green-700"
        case "UNCOMMON": return "border-blue-300 bg-blue-50 text-blue-600"
        case "COMMON": return "border-slate-400 bg-slate-100 text-slate-700"
        default: return "border-slate-800 bg-slate-800 text-white"
    }
}

export default function InventoryClient({ deviceInventory }: { deviceInventory: DeviceWithPets[] }) {
    const [search, setSearch] = useState("")
    const [selectedRarity, setSelectedRarity] = useState("ALL")
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
    const [byDevice, setByDevice] = useState(false)

    const filteredDevices = useMemo(() => {
        const devices = selectedDevice
            ? deviceInventory.filter((d) => d.deviceId === selectedDevice)
            : deviceInventory

        return devices.map((device) => ({
            ...device,
            pets: device.pets.filter((pet) => {
                const matchesSearch = pet.name.toLowerCase().includes(search.toLowerCase())
                const matchesRarity = selectedRarity === "ALL" || pet.pet?.rarity === selectedRarity
                return matchesSearch && matchesRarity
            }),
        })).filter((device) => device.pets.length > 0)
    }, [deviceInventory, search, selectedRarity, selectedDevice])

    const totalPets = filteredDevices.flatMap((d) => d.pets).reduce((sum, p) => sum + p.quantity, 0)

    return (
        <div className="mt-10 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory</h1>
                <p className="mt-1 text-slate-600">All pets across your accounts</p>
            </div>

            {/* Search & Filter Bar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="relative w-full xl:max-w-xl">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by pet name..."
                            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => setByDevice((v) => !v)}
                            className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition ${
                                byDevice
                                    ? "border-sky-400 bg-sky-100 text-sky-800"
                                    : "border-sky-200 bg-sky-50 text-sky-700"
                            }`}
                        >
                            <Monitor size={16} />
                            By Device
                        </button>
                    </div>
                </div>

                {/* Rarity Filter */}
                <div className="flex flex-wrap gap-2">
                    {RARITIES.map((rarity) => (
                        <button
                            key={rarity}
                            onClick={() => setSelectedRarity(rarity)}
                            className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide transition ${rarityFilterClass(rarity, selectedRarity === rarity)}`}
                        >
                            {rarity === "ALL" ? "All" : rarity === "ULTRA_RARE" ? "Ultra Rare" : rarity.charAt(0) + rarity.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {/* Device Filter (shown when By Device is on) */}
                {byDevice && (
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedDevice(null)}
                            className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition ${
                                selectedDevice === null
                                    ? "border-slate-800 bg-slate-800 text-white"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                        >
                            All Devices
                        </button>
                        {deviceInventory.map((device) => (
                            <button
                                key={device.deviceId}
                                onClick={() => setSelectedDevice(device.deviceId)}
                                className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition ${
                                    selectedDevice === device.deviceId
                                        ? "border-sky-500 bg-sky-500 text-white"
                                        : "border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-300"
                                }`}
                            >
                                <Monitor size={14} />
                                {device.deviceName}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Results */}
            {filteredDevices.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400 shadow-sm">
                    No pets found matching your filters.
                </div>
            ) : byDevice ? (
                // Grouped by device
                filteredDevices.map((device) => {
                    const deviceTotal = device.pets.reduce((sum, p) => sum + p.quantity, 0)
                    return (
                        <div key={device.deviceId} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-center gap-3 border-b border-slate-100 pb-4">
                                <Monitor size={16} className="text-slate-500" />
                                <h2 className="font-semibold text-slate-900">{device.deviceName}</h2>
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                                    {deviceTotal} pets
                                </span>
                            </div>
                            <PetGrid pets={device.pets} />
                        </div>
                    )
                })
            ) : (
                // All pets flat
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-center gap-3 border-b border-slate-100 pb-4">
                        <h2 className="font-semibold text-slate-900">All Pets</h2>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                            {totalPets} pets
                        </span>
                    </div>
                    <PetGrid pets={filteredDevices.flatMap((d) => d.pets)} />
                </div>
            )}
        </div>
    )
}

function PetGrid({ pets }: { pets: DeviceWithPets["pets"] }) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-5">
            {pets.map((item) => (
                <div
                    key={item.id}
                    className="group relative rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                    <div className="absolute left-3 top-3 rounded-md bg-slate-900 px-2 py-1 text-xs font-bold text-white">
                        {item.quantity}x
                    </div>

                    <div className="flex justify-center pt-8">
                        <img
                            src={item.thumbnailImage ?? "/placeholder.png"}
                            alt={item.name}
                            className="h-28 w-28 object-contain"
                        />
                    </div>

                    <div className="mt-4 text-center">
                        <h3 className="line-clamp-2 min-h-12 text-base font-semibold text-slate-900">
                            {item.name}
                        </h3>
                        <p className={`mt-1 text-xs font-bold uppercase tracking-wide ${rarityClass(item.pet?.rarity ?? "COMMON")}`}>
                            {item.pet?.rarity}
                        </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <button className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-800">
                            <Star size={15} />
                        </button>
                        <div className="flex items-center gap-2">
                            {item.pet?.variant === "NEON" && (
                                <span className="rounded-full border border-lime-200 bg-lime-50 px-2 py-1 text-[10px] font-bold text-lime-700">
                                    Neon
                                </span>
                            )}
                            {item.pet?.variant === "MEGA" && (
                                <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700">
                                    Mega
                                </span>
                            )}
                            {item.pet?.potion !== "NONE" && (
                                <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-1 text-[10px] font-bold text-sky-700">
                                    {item.pet?.potion === "FLY_RIDE" ? "Fly Ride" : item.pet?.potion === "RIDE" ? "Ride" : "Fly"}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                        <PawPrint size={13} />
                        <span>{item.accountCount} account{item.accountCount > 1 ? "s" : ""}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}