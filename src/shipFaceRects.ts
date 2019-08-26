import shipFaceRects from "./json/shipFaceRects.json"

/** [left, top, width, height] */
export type Rect = [number, number, number, number]

interface ShipFaceRect {
  /** 艦船ID */
  id: number

  rect: Rect
}

export default shipFaceRects as ShipFaceRect[]
