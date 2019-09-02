import piromaps from "./json/piromaps.json"

export type PiroEnemy = { mainFleet: any[]; escortFleet: any[]; formation: number; count: number }

export type MapData = {
  mapId: number
  diff?: number
  nodes: Array<{ nodeId: string; enemies: PiroEnemy[] }>
}

export default piromaps as MapData[]
