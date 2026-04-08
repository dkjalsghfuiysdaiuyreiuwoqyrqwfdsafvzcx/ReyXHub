import { getInventoryByDevice } from "@/lib/actions/inventory/inventory-pets-actions"
import InventoryClient from "./inventory-client"

export default async function InventoryPage() {
    const deviceInventory = await getInventoryByDevice()
    return <InventoryClient deviceInventory={deviceInventory} />
}