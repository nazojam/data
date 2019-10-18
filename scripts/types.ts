import fs from "fs"
import { chain } from "lodash"
import { api_mst_ship, MstShip, ships } from "../src"
import { createEnum } from "./createEnum"

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

export const writeShipName = () => {
  const playerShipNames = dataChain
    .uniqBy("name")
    .filter(ship => ship.shipId <= 1500)
    .map(({ name }) => `  | "${name}"`)
    .value()

  const abyssalShipNames = dataChain
    .uniqBy("name")
    .filter(ship => ship.shipId > 1500)
    .map(({ name }) => `  | "${name}"`)
    .value()

  const playerShipType = `export type PlayerShipName =\r\n${playerShipNames.join("\r\n")}\r\n`
  const abyssalShipType = `export type AbyssalShipName =\r\n${abyssalShipNames.join("\r\n")}\r\n`

  const text = `${playerShipType}\r\n${abyssalShipType}\r\nexport type ShipName = PlayerShipName | AbyssalShipName\r\n`

  fs.writeFile("src/ShipName.ts", text, console.error)
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

  createEnum("src/AbyssalShipClass.ts", "AbyssalShipClass", classMap, false)
}
