import Axios from "axios"
import fs from "fs"
import { sum, flatMap, range } from "lodash"
import rawmaps, { PiroEnemy, MapData } from "./rawmaps"
import Signale from "signale"

const axios = Axios.create({ baseURL: "http://kc.piro.moe/api/routing" })

type MapKey = string

type RouteEdge = [string, string, number, number]
type Route = { [K in number]: RouteEdge }

const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec))

const createParams = async (mapKey: string, edges: string[], diff?: number) => {
  const params = {
    minDiff: diff,
    maxDiff: diff,
    minGaugeLevel: 0,
    maxGaugeLevel: 9999,
    minGauge: 1,
    maxGauge: 4
  }

  const getParams = (start: string) => ({
    ...params,
    map: mapKey,
    edges: edges.join(","),
    start
  })

  const { data }: { data: Record<string, number> } = await axios.get(
    `http://kc.piro.moe/api/routing/heatmaps/${mapKey}?minGauge=1&maxGauge=4&minGaugeLevel=0&maxGaugeLevel=9999&minEdges=0&maxEdges=99&minLos=-40&maxLos=999&minRadars=0&maxRadars=60&minRadarShips=0&maxRadarShips=12&minSpeed=5&maxSpeed=20&nodes=&edges=&fleetType=-1&losType=1&&showEdgeIds=false&retreats=true&cleared=-1&fleetComp=&escortComp=&start=2019-08-01`
  )
  const count = sum(edges.map(edge => data[edge]))

  if (count > 10000) {
    return getParams("2019-08-30")
  }
  if (count > 5000) {
    return getParams("2019-08-20")
  }
  if (count > 1000) {
    return getParams("2019-08-01")
  }
  if (count > 100) {
    return getParams("2019-04-01")
  }
  if (count > 50) {
    return getParams("2019-01-01")
  }
  return getParams("2018-01-01")
}

const getAllMapId = async () => {
  const res = await axios.get("/maps/all")
  return res.data as MapKey[]
}

const getNodeMap = async (key: MapKey) => {
  const res = await axios.get(`/maps/${key}`)
  const route: Route = res.data.route
  const nodeMap = new Map<string, string[]>()
  for (const [edgeId, edge] of Object.entries(route)) {
    const nodeId = edge[1]
    const edges = nodeMap.get(nodeId)
    if (edges === undefined) {
      nodeMap.set(nodeId, [edgeId])
      continue
    }
    edges.push(edgeId)
  }
  return nodeMap
}

export type PiroEnemycomps = { entryCount?: number; entries: PiroEnemy[] }

const getNodeEnemies = async (map: string, edges: string[], diff?: number): Promise<PiroEnemy[]> => {
  const params = await createParams(map, edges, diff)
  await sleep(1000)
  const res: { data: PiroEnemycomps } = await axios.get("/enemycomps", { params })
  return res.data.entries.map(enemy => ({ ...enemy, diff }))
}

const getEventNodeEnemies = async (map: string, edges: string[]): Promise<PiroEnemy[]> => {
  const res = await Promise.all([1, 2, 3, 4].map(diff => getNodeEnemies(map, edges, diff)))
  return res.flat()
}

class MapObject {
  constructor(public key: string) {}

  get id() {
    return Number(this.key.replace("-", ""))
  }

  get worldId() {
    return Math.floor(this.id / 10)
  }

  get areaId() {
    return this.id % 10
  }

  get isEvent() {
    return this.worldId > 10
  }

  public getMapData = async (): Promise<MapData> => {
    const { id: mapId, key: mapKey, isEvent } = this

    const nodeMap = await getNodeMap(mapKey)
    const nodes = new Array<{ nodeId: string; enemies: PiroEnemy[] }>()

    for (const [nodeId, edges] of nodeMap) {
      const signale = Signale.scope(`${mapKey} ${nodeId}`)
      let enemies: PiroEnemy[] | void
      if (isEvent) {
        enemies = await getEventNodeEnemies(mapKey, edges).catch(() => signale.fatal("error"))
      } else {
        enemies = await getNodeEnemies(mapKey, edges).catch(() => signale.fatal("error"))
      }

      if (!enemies || enemies.length === 0) {
        signale.pending("no enemy")
        continue
      }
      signale.success()
      nodes.push({ nodeId, enemies })
    }

    return { mapId, nodes }
  }
}

const download = async (keys: string[]) => {
  const mapList = keys.map(key => new MapObject(key))

  const results: MapData[] = []

  for (const map of mapList) {
    const found = rawmaps.find(({ mapId }) => mapId === map.id)

    if (!found || map.isEvent) {
      results.push(await map.getMapData())
    } else {
      results.push(found)
    }
  }

  const maps = flatMap(results)
  fs.writeFile("./rawmaps.json", JSON.stringify(maps), console.error)
}

const main = async () => {
  const keys = [[1, 6], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 2], [45, 2]].flatMap(([worldId, last]) =>
    range(1, last + 1).map(num => `${worldId}-${num}`)
  )
  download(keys)
}

main()
