import api_mst_shipgraph from '../src/api_mst_shipgraph'
import fs from 'fs'

const faceRects = api_mst_shipgraph.map(({ api_id, api_weda, api_wedb }) => {
  return {
    id: api_id,
    rect: api_weda.concat(api_wedb)
  }
})

fs.writeFile('src/json/shipFaceRects.json', JSON.stringify(faceRects), console.error)
