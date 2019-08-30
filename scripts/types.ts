import fs from "fs"
import { chain } from "lodash"
import { api_mst_ship, MstShip } from "../src"
import { createEnum } from "./createEnum"

const toAbyssalDisplay = (ship: MstShip) => ship.api_name + ship.api_yomi

const setMinor = (ships: MstShip[], baseValue: number, groupValue: number, grade: number) => {
  ships.forEach((ship, index) => {
    const minor = index / 10
    ship.api_sort_id = baseValue + groupValue + grade + minor
  })
}

const setGrade = (ships: MstShip[], baseValue: number, groupValue: number) => {
  chain(ships)
    .sortBy(toAbyssalDisplay)
    .groupBy(toAbyssalDisplay)
    .values()
    .forEach((ships, index) => {
      const grade = index + 1
      setMinor(ships, baseValue, groupValue, grade)
    })
    .value()
}

let groupValue = 0
chain(api_mst_ship)
  .filter(ship => ship.api_sort_id === 0)
  .forEach(ship => (ship.api_name = ship.api_name.replace(/後期型|-壊| バカンスmode|改/g, "")))
  .groupBy("api_name")
  .forEach((ships, group) => {
    groupValue += 10
    if (group.includes("級")) {
      setGrade(ships, 100000, groupValue)
    } else {
      setGrade(ships, 200000, groupValue)
    }
  })
  .value()

const baseChain = chain(api_mst_ship)

const dataChain = baseChain.sortBy("api_sort_id").map(ship => {
  const { api_id, api_name: name, api_sort_id } = ship
  const grade = api_sort_id % 10
  const kind = (api_sort_id - grade) / 10
  return { name, grade, kind }
})

const names = dataChain
  .unionBy("name")
  .map(({ name }) => `  | "${name}"`)
  .value()

fs.writeFile("src/ShipName.ts", `type ShipName =\r\n${names.join("\r\n")}\r\n`, console.error)

const kindData = dataChain
  .uniqBy(({ kind }) => kind)
  .map(({ kind, name }) => [name, kind] as [string, number])
  .value()

createEnum("src/ShipKind.ts", "ShipKind", kindData)
