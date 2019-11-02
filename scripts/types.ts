import fs from "fs"
import { chain } from "lodash"
import { api_mst_ship, api_mst_slotitem, MstShip } from "../src"
import { writeEnum } from "./writeEnum"

const isPlayerShip = (ship: MstShip) => ship.api_id <= 1500
const isAbyssalShip = (ship: MstShip) => !isPlayerShip(ship)

const dataChain = chain(api_mst_ship)
  .sortBy("api_sort_id")
  .map(ship => {
    const { api_id, api_name: name, api_sort_id } = ship
    const grade = api_sort_id % 10
    const kind = (api_sort_id - grade) / 10
    return { shipId: api_id, name, grade, kind }
  })

const createLiteralType = (typeName: string, types: string[]) => {
  const inner = types.map(type => `  | "${type}"`).join("\r\n")
  return `export type ${typeName} =\r\n${inner}\r\n`
}

export const writeShipName = () => {
  const playerShipNames = dataChain
    .uniqBy("name")
    .filter(ship => ship.shipId <= 1500)
    .map(({ name }) => name)
    .value()

  const abyssalShipNames = dataChain
    .uniqBy("name")
    .filter(ship => ship.shipId > 1500)
    .map(({ name }) => name)
    .value()

  const playerShipType = createLiteralType("PlayerShipName", playerShipNames)
  const abyssalShipType = createLiteralType("AbyssalShipName", abyssalShipNames)

  const text = `${playerShipType}\r\n${abyssalShipType}\r\nexport type ShipName = PlayerShipName | AbyssalShipName\r\n`

  fs.writeFile("src/ShipName.ts", text, console.error)
}

export const writeGearName = () => {
  const gearNames = api_mst_slotitem.map(({ api_name }) => api_name)
  const text = createLiteralType("GearName", gearNames)

  fs.writeFile("src/GearName.ts", text, console.error)
}

export const writeAbyssalShipClass = () => {
  const classNames = chain(api_mst_ship)
    .filter(isAbyssalShip)
    .map(ship => ship.api_name.replace(/後期型|-壊| バカンスmode|改/g, ""))
    .uniq()
    .value()

  const irohaClasses: string[] = []
  const specialClasses: string[] = []

  classNames.forEach(name => {
    if (name.includes("級")) {
      irohaClasses.push(name)
    } else {
      specialClasses.push(name)
    }
  })

  const irohaClassMap = irohaClasses.map((name, index) => [name, 1001 + index] as [string, number])
  const specialClassMap = specialClasses.map((name, index) => [name, 2001 + index] as [string, number])
  const classMap = irohaClassMap.concat(specialClassMap)

  writeEnum("src/AbyssalShipClass.ts", "AbyssalShipClass", classMap, false)
}

export const writeShipId = () =>
  writeEnum("src/ShipId.ts", "ShipId", api_mst_ship.map(({ api_name, api_id }) => [api_name, api_id]))
export const writeGearId = () =>
  writeEnum("src/GearId.ts", "GearId", api_mst_slotitem.map(({ api_name, api_id }) => [api_name, api_id]))

writeAbyssalShipClass()
writeShipName()
writeGearName()
writeShipId()
writeGearId()
