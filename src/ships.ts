import ships from "./json/ships.json"

export type ShipStat = number | [number, number]
export interface ShipData {
  id: number
  sortNo: number
  sortId: number
  name: string
  readingName: string
  shipTypeId: number
  classId: number
  hp: ShipStat
  firepower: ShipStat
  armor: ShipStat
  torpedo: ShipStat
  evasion: ShipStat
  antiAir: ShipStat
  asw: ShipStat
  speed: number
  los: ShipStat
  range: number
  luck: ShipStat
  fuel: number
  ammo: number
  slotCapacities: Readonly<number[]>
  equipments: (number | { id: number; improvement: number })[]
  remodel?: Readonly<{
    nextId: number
    nextLevel: number
  }>
  /** 特殊な装備可能設定 */
  equippable?: {
    /** 装備カテゴリによる設定 */
    categories?: number[]
    /** 補強増設に装備できるID一覧 */
    expantionSlot?: number[]
  }
}

export default ships as ShipData[]
