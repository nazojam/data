import maps from "./json/formattedMaps.json"

export type MapEnemyShip = {
  id: number
  level: number
}

export type MapEnemyFleet = {
  mainFleet: MapEnemyShip[]
  escortFleet: MapEnemyShip[]
  formation: number
  difficulty?: number
}

export type MapNode = {
  nodeId: string
  enemies: MapEnemyFleet[]
}

export type Map = {
  mapId: number
  nodes: MapNode[]
}

export default maps
