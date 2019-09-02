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
