import api_mst_shipgraph from "./api_start2/parsed/api_mst_shipgraph.json"

type Point = [number, number]

type ApiMstShipgraph = {
  /** 艦船ID */
  api_id: number

  /** 図鑑番号 */
  api_sortno: number

  /** ファイル名 */
  api_filename: string

  /** ファイルのバージョン [グラフィック, ボイス, 母港ボイス] */
  api_version: [string, string, string]

  api_boko_n: Point
  api_boko_d: Point
  api_kaisyu_n: Point
  api_kaisyu_d: Point
  api_kaizo_n: Point
  api_kaizo_d: Point
  api_map_n: Point
  api_map_d: Point
  api_ensyuf_n: Point
  api_ensyuf_d: Point
  api_ensyue_n: Point
  api_battle_n: Point
  api_battle_d: Point

  /** ケッコンカッコカリの顔枠の左上座標 */
  api_weda: Point

  /** ケッコンカッコカリの顔枠の[幅, 高さ] */
  api_wedb: Point
}[]

export default api_mst_shipgraph as ApiMstShipgraph
