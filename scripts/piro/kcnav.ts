import Axios from "axios"

type MapKey = string

enum NodeColor {
  Unknown = -1,
  Start = 0,
  Resource = 2,
  Maelstrom = 3,
  Normal = 4,
  Boss = 5,
  Transport = 6,
  Aerial = 7,
  Bounty = 8,
  AerialReconnaissance = 9,
  AirDefense = 10,
  LongRangeRadarAmbush = 13,
  EmergencyAnchorageRepair = 14,

  NoEnemy = 90,
  Selector = 91
}

enum NodeEvent {
  Unknown = -1,
  Start = 0,
  Resource = 2,
  Maelstrom = 3,
  Normal = 4,
  Boss = 5,
  Avoided = 6,
  Aerial = 7,
  Bounty = 8,
  Transport = 9,
  EmergencyAnchorageRepair = 10
}

type Prev = MapKey | null
type Next = MapKey

type RouteEdge = [Prev, Next, NodeColor, NodeEvent]
type Route = { [K in number]: RouteEdge }

type X = number
type Y = number
type Start = "Start" | null
type Spot = [X, Y, Start]

type MapResponse = {
  route: Route
  spots: { [K in string]: Spot }
}

const isBattleNode = (event: NodeEvent) => {
  switch (event) {
    case NodeEvent.Unknown:
    case NodeEvent.Start:
    case NodeEvent.Resource:
    case NodeEvent.Maelstrom:
    case NodeEvent.Avoided:
    case NodeEvent.Bounty:
    case NodeEvent.Transport:
    case NodeEvent.EmergencyAnchorageRepair:
      return false
  }
  return true
}

const client = Axios.create({ baseURL: "http://kc.piro.moe/api/routing" })

const heatmapParams = {
  maxGauge: 4,
  minGaugeLevel: 0,
  maxGaugeLevel: 9999,
  minEdges: 0,
  maxEdges: 99,
  minLos: -40,
  maxLos: 999,
  minRadars: 0,
  maxRadars: 60,
  minRadarShips: 0,
  maxRadarShips: 12,
  minSpeed: 5,
  maxSpeed: 20,
  nodes: "",
  edges: "",
  fleetType: -1,
  losType: 1,
  radarType: 0,
  difficulty: 0,
  showEdgeIds: false,
  showLbasDistance: true,
  showMapBackground: true,
  retreats: true,
  cleared: -1,
  mainComp: "",
  useMainFs: false,
  escortComp: "",
  useEscortFs: false,
  allComp: "",
  start: "2020-03-01"
}

const getHeatmaps = (mapKey: string) =>
  client
    .get<{ result: Record<string, number> }>(`/heatmaps/${mapKey}`, { params: heatmapParams })
    .then(res => res.data.result)

const getRouteData = (key: MapKey) => client.get<MapResponse>(`/maps/${key}`).then(res => res.data)

const getNodeRecord = async (key: MapKey) => {
  const { route, spots } = await getRouteData(key)

  const nodeRecord = new Map<string, string[]>()
  for (const [edgeId, edge] of Object.entries(route)) {
    const [, nodeId, , event] = edge
    if (!isBattleNode(event)) {
      continue
    }

    const edges = nodeRecord.get(nodeId)
    if (edges === undefined) {
      nodeRecord.set(nodeId, [edgeId])
    } else {
      edges.push(edgeId)
    }
  }
  return nodeRecord
}

export default {
  getHeatmaps,
  getNodeRecord
}
