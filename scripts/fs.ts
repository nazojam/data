import { ShipData } from "../src"
import fs from "fs"

export const writeFile = fs.promises.writeFile

export const writeShips = (ships: ShipData[]) => writeFile("src/json/ships.json", JSON.stringify(ships))

export default {
  writeFile,
  writeShips
}
