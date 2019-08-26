import api_mst_slotitem from "./api_start2/parsed/api_mst_slotitem.json"

export interface MstEquipment {
  api_id: number
  api_sortno: number
  api_name: string
  api_type: [number, number, number, number, number]
  api_taik: number
  api_souk: number
  api_houg: number
  api_raig: number
  api_soku: number
  api_baku: number
  api_tyku: number
  api_tais: number
  api_atap: number
  api_houm: number
  api_raim: number
  api_houk: number
  api_raik: number
  api_bakk: number
  api_saku: number
  api_sakb: number
  api_luck: number
  api_leng: number
  api_cost: number
  api_distance?: number
  api_rare: number
  api_broken: [number, number, number, number]
  api_info: string
  api_usebull: string
  api_version: number
}

export default api_mst_slotitem as MstEquipment[]
