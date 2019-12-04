import { MapEnemyFleet, ships } from "../../src"
import { NodeData, PiroEnemy, PiroShip, MapData } from "./rawmaps"
import Signale from "signale"

export const formatMaps = (rawmaps: MapData[]) => {
  const shipMap = new Map<number, PiroShip>()

  const formatShip = (ship: PiroShip) => {
    const { id, lvl } = ship
    shipMap.set(id, ship)

    return { id, level: lvl }
  }
  const formatEnemy = ({ mainFleet, escortFleet, formation, diff }: PiroEnemy): MapEnemyFleet => {
    return {
      mainFleet: mainFleet.map(formatShip),
      escortFleet: escortFleet.map(formatShip),
      formation,
      difficulty: diff
    }
  }

  const formatNode = ({ nodeId, enemies }: NodeData) => ({ nodeId, enemies: enemies.map(formatEnemy) })

  const formattedMaps = rawmaps.map(data => ({
    mapId: data.mapId,
    nodes: data.nodes.map(formatNode)
  }))

  for (const [id, piroShip] of shipMap) {
    const dataShip = ships.find(ship => ship.id === id)
    if (!dataShip) {
      continue
    }
    const signale = Signale.scope(dataShip.name)

    if (piroShip.armor !== undefined && piroShip.armor !== dataShip.armor) {
      signale.fatal(`armor ${piroShip.armor} !== ${dataShip.armor}`)
      dataShip.armor = piroShip.armor
    }
    if (piroShip.hp !== undefined && piroShip.hp !== dataShip.hp) {
      signale.fatal(`hp ${piroShip.hp} !== ${dataShip.hp}`)
      dataShip.hp = piroShip.hp
    }
    if (piroShip.torp !== undefined && piroShip.torp !== dataShip.torpedo) {
      signale.fatal(`armor ${piroShip.torp} !== ${dataShip.torpedo}`)
      dataShip.torpedo = piroShip.torp
    }
    if (piroShip.fp !== undefined && piroShip.fp !== dataShip.firepower) {
      signale.fatal(`armor ${piroShip.fp} !== ${dataShip.firepower}`)
      dataShip.firepower = piroShip.fp
    }

    const equips = piroShip.equips.filter(eq => eq > 0)
    if (!equips.every((eq, index) => eq === dataShip.equipments[index])) {
      signale.fatal(`equip ${equips} !== ${dataShip.equipments}`)
      dataShip.equipments = equips
    }
  }

  return { ships, formattedMaps }
}
