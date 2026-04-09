"use client"

import { useState, useMemo } from "react"
import { Search, Monitor, PawPrint, Star, X, User } from "lucide-react"
import type { DeviceWithPets } from "@/lib/actions/inventory/inventory-pets-actions"

// ── types ────────────────────────────────────────────────────────────────────

type PetAccount = { id: string; name: string }
type InventoryPet = DeviceWithPets["pets"][number]

// ── helpers (unchanged) ──────────────────────────────────────────────────────

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

function mergeAllPets(devices: DeviceWithPets[]): InventoryPet[] {
    const petMap = new Map<string, InventoryPet & { _accountMap: Map<string, PetAccount> }>()

    for (const device of devices) {
        for (const pet of device.pets) {
            const key = [pet.name, pet.pet?.variant ?? "NORMAL", pet.pet?.potion ?? "NONE"].join("|")

            if (!petMap.has(key)) {
                petMap.set(key, { ...pet, quantity: 0, accounts: [], accountCount: 0, _accountMap: new Map() })
            }

            const existing = petMap.get(key)!
            existing.quantity += pet.quantity

            for (const acc of pet.accounts) {
                existing._accountMap.set(acc.id, acc)
            }

            if (!existing.thumbnailImage && pet.thumbnailImage) {
                existing.thumbnailImage = pet.thumbnailImage
            }
        }
    }

    return Array.from(petMap.values()).map(({ _accountMap, ...pet }) => ({
        ...pet,
        accounts: Array.from(_accountMap.values()),
        accountCount: _accountMap.size,
    }))
}

// ── AccountsModal ─────────────────────────────────────────────────────────────

function AccountsModal({
    petName,
    accounts,
    onClose,
}: {
    petName: string
    accounts: PetAccount[]
    onClose: () => void
}) {
    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Panel — stop clicks propagating to backdrop */}
            <div
                className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Owned by</p>
                        <h2 className="text-lg font-semibold text-slate-900">{petName}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-400 transition hover:border-slate-300 hover:text-slate-700"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Account list */}
                <ul className="space-y-2">
                    {accounts.map((acc) => (
                        <li
                            key={acc.id}
                            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                                <User size={14} />
                            </div>
                            <span className="text-sm font-medium text-slate-800">{acc.name}</span>
                        </li>
                    ))}
                </ul>

                {/* Footer count */}
                <p className="mt-4 text-center text-xs text-slate-400">
                    {accounts.length} account{accounts.length !== 1 ? "s" : ""}
                </p>
            </div>
        </div>
    )
}

// ── PetGrid ───────────────────────────────────────────────────────────────────

function PetGrid({ pets }: { pets: InventoryPet[] }) {
    const [modalPet, setModalPet] = useState<InventoryPet | null>(null)

    return (
        <>
            {modalPet && (
                <AccountsModal
                    petName={modalPet.name}
                    accounts={modalPet.accounts}
                    onClose={() => setModalPet(null)}
                />
            )}

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {pets.map((item) => (
                    <div
                        key={[item.name, item.pet?.variant, item.pet?.potion].join("|")}
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

                        {/* Accounts button — now clickable */}
                        <button
                            onClick={() => setModalPet(item)}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
                        >
                            <PawPrint size={13} />
                            <span>{item.accountCount} account{item.accountCount !== 1 ? "s" : ""}</span>
                        </button>
                    </div>
                ))}
            </div>
        </>
    )
}

// ── InventoryClient (unchanged logic, updated mergeAllPets call) ──────────────

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

    const allPets = useMemo(() => mergeAllPets(filteredDevices), [filteredDevices])
    const totalPets = allPets.reduce((sum, p) => sum + p.quantity, 0)

    return (
        <div className="mt-10 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory</h1>
                <p className="mt-1 text-slate-600">All pets across your accounts</p>
            </div>

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

            {allPets.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400 shadow-sm">
                    No pets found matching your filters.
                </div>
            ) : byDevice ? (
                filteredDevices.map((device) => {
                    const devicePets = mergeAllPets([device])
                    const deviceTotal = devicePets.reduce((sum, p) => sum + p.quantity, 0)
                    return (
                        <div key={device.deviceId} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-center gap-3 border-b border-slate-100 pb-4">
                                <Monitor size={16} className="text-slate-500" />
                                <h2 className="font-semibold text-slate-900">{device.deviceName}</h2>
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                                    {deviceTotal} pets
                                </span>
                            </div>
                            <PetGrid pets={devicePets} />
                        </div>
                    )
                })
            ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-center gap-3 border-b border-slate-100 pb-4">
                        <h2 className="font-semibold text-slate-900">All Pets</h2>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                            {totalPets} pets
                        </span>
                    </div>
                    <PetGrid pets={allPets} />
                </div>
            )}
        </div>
    )
}