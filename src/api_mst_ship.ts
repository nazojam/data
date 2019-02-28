import api_mst_ship from './api_start2/parsed/api_mst_ship.json'

type MstStat = [number, number]

type MstSlotCapacities = [number, number, number, number, number]

type MstMaterials = [number, number, number, number]

export interface MstAbysallShip {
  api_id: number
  api_sort_id: number
  api_name: string
  api_yomi: string
  api_stype: number
  api_ctype: number
  api_soku: number
  api_slot_num: number
}

export interface MstAllyShip {
  api_id: number
  api_sortno: number
  api_sort_id: number
  api_name: string
  api_yomi: string
  api_stype: number
  api_ctype: number
  api_afterlv: number
  api_aftershipid: string
  /** 耐久 */
  api_taik: MstStat
  /** 装甲 */
  api_souk: MstStat
  /** 火力 */
  api_houg: MstStat
  api_raig: MstStat
  /** 対空 */
  api_tyku: MstStat
  /** 護衛空母のみ存在 */
  api_tais?: [number]
  api_luck: MstStat
  api_soku: number
  api_leng: number
  api_slot_num: number
  api_maxeq: MstSlotCapacities
  api_buildtime: number
  api_broken: MstMaterials
  api_powup: MstMaterials
  api_backs: number
  api_getmes: string
  api_afterfuel: number
  api_afterbull: number
  api_fuel_max: number
  api_bull_max: number
  api_voicef: number
}

export type MstShip = MstAbysallShip | MstAllyShip

export default api_mst_ship as MstShip[]
