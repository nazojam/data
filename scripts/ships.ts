import fs from "fs"
import {
  api_mst_equip_exslot_ship,
  api_mst_equip_ship,
  api_mst_ship,
  ShipData,
  MstAllyShip,
  MstShip,
  ships
} from "../src"

const isMstAllyShip = (mstShip: MstShip): mstShip is MstAllyShip => "api_houg" in mstShip

const getSlotCapacities = (mstShip: MstShip, shipData?: ShipData) => {
  const { api_slot_num } = mstShip
  if ("api_maxeq" in mstShip) {
    const { api_maxeq } = mstShip
    return Array.from({ length: api_slot_num }, (_, i) => api_maxeq[i])
  }
  if (!shipData) {
    return new Array(api_slot_num).fill(-1)
  }
  return shipData.slotCapacities
}

const getRemodel = (mstShip: MstShip) => {
  if ("api_afterlv" in mstShip) {
    const { api_aftershipid, api_afterlv } = mstShip
    return {
      nextId: Number(api_aftershipid),
      nextLevel: api_afterlv
    }
  }
  return {
    nextId: 0,
    nextLevel: 0
  }
}

const getEquippable = (masterId: number) => {
  const found = api_mst_equip_ship.find(({ api_ship_id }) => api_ship_id === masterId)
  const expantionSlot = api_mst_equip_exslot_ship
    .filter(({ api_ship_ids }) => api_ship_ids.includes(masterId))
    .map(({ api_slotitem_id }) => api_slotitem_id)
  if (found || expantionSlot.length > 0) {
    return {
      categories: found && found.api_equip_type,
      expantionSlot
    }
  }
  return undefined
}

const createShipData = (apiShip: MstShip): ShipData => {
  if (isMstAllyShip(apiShip)) {
    return {
      id: apiShip.api_id,
      sortNo: apiShip.api_sortno,
      sortId: apiShip.api_sort_id,
      name: apiShip.api_name,
      readingName: apiShip.api_yomi,
      shipTypeId: apiShip.api_stype,
      classId: apiShip.api_ctype,
      hp: apiShip.api_taik,
      firepower: apiShip.api_houg,
      armor: apiShip.api_souk,
      torpedo: apiShip.api_raig,
      evasion: -1,
      asw: -1,
      los: -1,
      antiAir: apiShip.api_tyku,
      speed: apiShip.api_soku,
      range: apiShip.api_leng,
      luck: apiShip.api_luck,
      fuel: apiShip.api_fuel_max,
      ammo: apiShip.api_bull_max,
      slotCapacities: getSlotCapacities(apiShip),
      equipments: [],
      remodel: getRemodel(apiShip),
      equippable: getEquippable(apiShip.api_id)
    }
  }
  return {
    id: apiShip.api_id,
    sortNo: 0,
    sortId: apiShip.api_sort_id,
    name: apiShip.api_name,
    readingName: apiShip.api_yomi,
    shipTypeId: apiShip.api_stype,
    classId: apiShip.api_ctype,
    hp: -2,
    firepower: -2,
    armor: -2,
    torpedo: -2,
    evasion: -1,
    asw: -1,
    los: -1,
    antiAir: -2,
    speed: apiShip.api_soku,
    range: -2,
    luck: -2,
    fuel: 0,
    ammo: 0,
    slotCapacities: getSlotCapacities(apiShip),
    equipments: [],
    remodel: getRemodel(apiShip)
  }
}

const newShipsData = new Array<ShipData>()
for (const apiShip of api_mst_ship) {
  const shipData = ships.find(({ id }) => id === apiShip.api_id)

  if (!shipData) {
    console.error(`create ${apiShip.api_name}`)
    newShipsData.push(createShipData(apiShip))
    continue
  }

  if (isMstAllyShip(apiShip)) {
    const nextShipData = createShipData(apiShip)
    nextShipData.evasion = shipData.evasion
    nextShipData.asw = shipData.asw
    nextShipData.los = shipData.los
    nextShipData.slotCapacities = shipData.slotCapacities
    nextShipData.equipments = shipData.equipments

    newShipsData.push(nextShipData)
    continue
  }

  newShipsData.push(shipData)
}

fs.writeFile("src/json/ships.json", JSON.stringify(newShipsData), console.error)
