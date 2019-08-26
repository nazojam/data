import fs from "fs"
import { api_mst_ship, api_mst_slotitem } from "../src"

export const createEnum = (fileName: string, enumName: string, data: [string, number][]) => {
  const names = data.map(([name]) => name)
  const duplicatedNames = names.filter(name => names.indexOf(name) !== names.lastIndexOf(name))

  let inner = ""
  let isFirst = true
  data.forEach(([name, value]) => {
    const key = duplicatedNames.includes(name) ? `${name} id${value}` : name
    const line = `${isFirst ? "" : ","}\r\n  "${key}" = ${value}`
    isFirst = false
    inner += line
  })

  const text = `export const enum ${enumName} {${inner}\r\n}\r\n`
  fs.writeFile(fileName, text, console.error)
}

createEnum("src/ShipId.ts", "ShipId", api_mst_ship.map(({ api_name, api_id }) => [api_name, api_id]))
createEnum("src/GearId.ts", "GearId", api_mst_slotitem.map(({ api_name, api_id }) => [api_name, api_id]))
