import { MapEnemyFleet } from "../../src"
import rawmaps, { NodeData, PiroEnemy, PiroShip } from "./rawmaps"
import fs from "fs"

const shipMap = new Map<number, PiroShip>()

const formatShip = (ship: PiroShip) => {
  const { id, lvl } = ship
  shipMap.set(id, ship)

  return { id, level: lvl }
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

const formattedMaps = rawmaps.map(data => ({
  mapId: data.mapId,
  nodes: data.nodes.map(formatNode)
}))

fs.writeFile("src/json/formattedMaps.json", JSON.stringify(formattedMaps), console.error)
