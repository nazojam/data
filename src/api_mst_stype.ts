import api_mst_stype from './api_start2/parsed/api_mst_stype.json'

interface MstShipType {
  api_id: number
  api_sortno: number
  api_name: string
  api_scnt: number
  api_kcnt: number
  api_equip_type: {
    [K: string]: 0 | 1
  }
}

export default api_mst_stype as MstShipType[]
