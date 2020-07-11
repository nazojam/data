import fs from "fs"
import { chain } from "lodash"
import { api_mst_ship, api_mst_slotitem, MstShip, ships } from "../src"

const isPlayerShip = (ship: MstShip) => ship.api_id <= 1500
const isAbyssalShip = (ship: MstShip) => !isPlayerShip(ship)

const dataChain = chain(api_mst_ship)
  .sortBy("api_sort_id")
  .map((ship) => {
    const { api_id, api_name: name, api_sort_id } = ship
    const rank = api_sort_id % 10
    const individual = (api_sort_id - rank) / 10
    return { shipId: api_id, name, rank, individual }
  })

export const createLiteralType = (typeName: string, types: string[]) => {
  const inner = types.map((type) => `  | "${type}"`).join("\r\n")
  return `export type ${typeName} =\r\n${inner}\r\n`
}

export const createEnum = (enumName: string, data: (readonly [string, number])[], isConst = true) => {
  const names = data.map(([name]) => name)
  const duplicatedNames = names.filter((name) => names.indexOf(name) !== names.lastIndexOf(name))
  const inner = data
    .map(([name, value]) => {
      const key = duplicatedNames.includes(name) ? `${name} id${value}` : name
      const line = `  "${key}" = ${value}`
      return line
    })
    .join(",\r\n")

  return `export${isConst ? " const" : ""} enum ${enumName} {\r\n${inner}\r\n}\r\n`
}

export const writeEnum = (fileName: string, ...params: Parameters<typeof createEnum>) => {
  const text = createEnum(...params)
  return fs.promises.writeFile(fileName, text)
}

export const writeShipName = () => {
  const playerShipNames = dataChain
    .uniqBy("name")
    .filter((ship) => ship.shipId <= 1500)
    .map(({ name }) => name)
    .value()

  const abyssalShipNames = dataChain
    .uniqBy("name")
    .filter((ship) => ship.shipId > 1500)
    .map(({ name }) => name)
    .value()

  const playerShipType = createLiteralType("PlayerShipName", playerShipNames)
  const abyssalShipType = createLiteralType("AbyssalShipName", abyssalShipNames)

  const text = `${playerShipType}\r\n${abyssalShipType}\r\nexport type ShipName = PlayerShipName | AbyssalShipName\r\n`

  return fs.promises.writeFile("src/ShipName.ts", text)
}

export const writeGearName = () => {
  const gearNames = api_mst_slotitem.map(({ api_name }) => api_name)
  const text = createLiteralType("GearName", gearNames)

  return fs.promises.writeFile("src/GearName.ts", text)
}

const nameToClass = (name: string) => name.replace(/後期型|-壊| バカンスmode|改|II| 夏季上陸mode| 夏mode/g, "")

const getAbyssalShipClassMap = () => {
  const classNames = chain(api_mst_ship)
    .filter(isAbyssalShip)
    .map((ship) => nameToClass(ship.api_name))
    .uniq()
    .value()

  const irohaClasses: string[] = []
  const specialClasses: string[] = []

  classNames.forEach((name) => {
    if (name.includes("級")) {
      irohaClasses.push(name)
    } else {
      specialClasses.push(name)
    }
  })

  const irohaClassMap = irohaClasses.map((name, index) => [name, 1001 + index] as [string, number])
  const specialClassMap = specialClasses.map((name, index) => [name, 2001 + index] as [string, number])
  return irohaClassMap.concat(specialClassMap)
}

export const writeAbyssalShipClass = async () => {
  const classMap = getAbyssalShipClassMap()

  const nextShips = ships.map((ship) => {
    const next = { ...ship }
    const className = nameToClass(ship.name)
    const found = classMap.find(([name, classId]) => name === className)
    if (found) {
      next.classId = found[1]
    }
    return next
  })

  await fs.promises.writeFile("src/json/ships.json", JSON.stringify(nextShips))
  await writeEnum("src/AbyssalShipClass.ts", "AbyssalShipClass", classMap, false)
}

export const writeShipId = () =>
  writeEnum(
    "src/ShipId.ts",
    "ShipId",
    api_mst_ship.map(({ api_name, api_id }) => [api_name, api_id])
  )
export const writeGearId = () =>
  writeEnum(
    "src/GearId.ts",
    "GearId",
    api_mst_slotitem.map(({ api_name, api_id }) => [api_name, api_id])
  )

export const writeRemodelGroup = () => {
  const data = dataChain
    .filter((ship) => ship.shipId < 1500 && ship.rank === 1)
    .uniqBy("individual")
    .map((ship) => [ship.name, ship.shipId] as const)
    .value()

  return writeEnum("src/RemodelGroup.ts", "RemodelGroup", data)
}

export const writeTypes = async () => {
  await writeAbyssalShipClass()
  await writeShipName()
  await writeGearName()
  await writeShipId()
  await writeGearId()
  await writeRemodelGroup()
}
