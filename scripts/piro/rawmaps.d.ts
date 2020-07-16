export type PiroShip = {
  id: number
  lvl: number
  hp?: number
  fp?: number
  torp?: number
  aa?: number
  armor?: number
  equips: [number, number, number, number, number]
}

export type PiroEnemy = {
  mainFleet: PiroShip[]
  escortFleet: PiroShip[]
  formation: number
  count: number
  diff?: number
}
export type NodeData = { nodeId: string; enemies: PiroEnemy[] }
export type MapData = { mapId: number; nodes: NodeData[] }

declare const rawmaps: MapData[]
export default rawmaps
