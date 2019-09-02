import { ships } from "../../src"
import rawmaps, { MapData, NodeData, PiroEnemy, PiroShip } from "./rawmaps"
import Signale from "signale"
import fs from "fs"

const shipMap = new Map<number, PiroShip>()

const formatShip = (ship: PiroShip) => {
  const { id, lvl, equips } = ship
  shipMap.set(id, ship)

  return { id, level: lvl, equipment: equips.filter(id => id > 0) }
}

type MapEnemyShip = {
  id: number
  level: number
  equipment: number[]
}

type MapEnemyFleet = {
  mainFleet: MapEnemyShip[]
  escortFleet: MapEnemyShip[]
  formation: number
  difficulty?: number
}

const formatEnemy = ({ mainFleet, escortFleet, formation, diff }: PiroEnemy): MapEnemyFleet => {
  return {
    mainFleet: mainFleet.map(formatShip),
    escortFleet: escortFleet.map(formatShip),
    formation,
    difficulty: diff
  }
}

const formatNode = ({ nodeId, enemies }: NodeData) => ({ nodeId, enemies: enemies.map(formatEnemy) })

const maps = rawmaps.map(data => ({
  mapId: data.mapId,
  nodes: data.nodes.map(formatNode)
}))

for (const [id, enemy] of shipMap) {
  let signale = Signale.scope(id.toString())
  const data = ships.find(data => data.id === id)
  if (!data) {
    signale.fatal(`${id} is not found`)
    continue
  }
  signale = Signale.scope(`${id} ${data.name}`)

  enemy.equips
    .filter(num => num > 0)
    .forEach((eq, index) => {
      if (eq !== data.equipments[index]) {
        data.equipments[index] = eq
        signale.fatal(`equips is not matched ${eq} !== ${data.equipments[index]}`)
      }
    })
}

fs.writeFile("src/json/ships.json", JSON.stringify(ships), console.error)
