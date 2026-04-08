import prisma from "@/lib/prisma"
import { getSession } from "../auth-actions"
import { PetPotion, PETRARITY, PetVariant } from "@/app/generated/prisma/enums"

type InventoryPet = {
    id: string
    name: string
    quantity: number
    thumbnailImage: string | null
    accountCount: number
    pet: {
        variant: PetVariant
        potion: PetPotion
        rarity: PETRARITY
    } | null
}

export type DeviceWithPets = {
    deviceId: string
    deviceName: string
    pets: InventoryPet[]
}

export async function getInventoryByDevice(): Promise<DeviceWithPets[]> {
    const session = await getSession()

    if (!session?.user?.id) return []

    const devices = await prisma.accountDevice.findMany({
        where: {
            playerAccounts: {
                some: {
                    userId: session.user.id,
                },
            },
        },
        include: {
            playerAccounts: {
                where: {
                    userId: session.user.id,
                },
                include: {
                    items: {
                        where: { type: "PET" },
                        include: { pet: true },
                    },
                },
            },
        },
    })

    return devices.map((device) => {
        const petMap = new Map<String, {
            id: string
            name: string
            quantity: number
            thumbnailImage: string | null
            pet: { variant: PetVariant; potion: PetPotion; rarity: PETRARITY } | null
            accountIds: Set<string>
        }>()

        for (const account of device.playerAccounts) {
            for (const item of account.items) {
                const key = [
                    item.name,
                    item.pet?.variant ?? "NORMAL",
                    item.pet?.potion ?? "NONE",
                ].join("|")

                if (!petMap.has(key)) {
                    petMap.set(key, {
                        id: item.id,
                        name: item.name,
                        quantity: 0,
                        thumbnailImage: item.thumbnailImage ?? null,
                        pet: item.pet ? {
                            variant: item.pet.variant,
                            potion: item.pet.potion,
                            rarity: item.pet.rarity,
                        } : null,
                        accountIds: new Set(),
                    })
                }

                const existing = petMap.get(key)!
                existing.quantity += item.quantity
                existing.accountIds.add(account.id)
                if (!existing.thumbnailImage && item.thumbnailImage) {
                    existing.thumbnailImage = item.thumbnailImage
                }
            }
        }

        return {
            deviceId: device.id,
            deviceName: device.name,
            pets: Array.from(petMap.values()).map((pet) => ({
                id: pet.id,
                name: pet.name,
                quantity: pet.quantity,
                thumbnailImage: pet.thumbnailImage,
                pet: pet.pet,
                accountCount: pet.accountIds.size,
            })),
        }
    })
}