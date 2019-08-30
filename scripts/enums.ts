import { api_mst_ship, api_mst_slotitem } from "../src"
import { createEnum } from "./createEnum"

createEnum("src/ShipId.ts", "ShipId", api_mst_ship.map(({ api_name, api_id }) => [api_name, api_id]))
createEnum("src/GearId.ts", "GearId", api_mst_slotitem.map(({ api_name, api_id }) => [api_name, api_id]))
