import shipFaceRects from './json/shipFaceRects.json'

type Rect = [number, number, number, number]

interface ShipFaceRect {
  /** 艦船ID */
  id: number

  rect: Rect
}

export default shipFaceRects as ShipFaceRect[]
