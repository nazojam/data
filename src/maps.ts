import maps from "./json/maps.json"

export type EventDifficulty = 1 | 2 | 3 | 4
export type EnemyFleet = {
  ships: number[]
  formation: string
  difficulty?: EventDifficulty
}
export type CellData = {
  point: string
  enemies?: EnemyFleet[]
}
export type MapData = {
  mapId: number
  cells: CellData[]
}
export default maps as MapData[]
