import { ships, ShipStat } from "../src"
import Datastore from "nedb"

const shipDatabase = new Datastore({
  filename: "scripts/WhoCallsTheFleet-DB/db/ships.nedb",
})

shipDatabase.loadDatabase(console.error)

const findShip = async (id: number) =>
  new Promise<any>((resolve, reject) =>
    shipDatabase.findOne({ id }, (err, ship: any) => {
      resolve(ship)
      reject(err)
    })
  )

const statToArray = (stat: ShipStat) => {
  if (typeof stat === "number") {
    return [stat, stat] as const
  }
  return stat
}

for (const masterShip of ships) {
  it(masterShip.name, async () => {
    const dbShip = await findShip(masterShip.id)
    if (!dbShip || !dbShip.stat || dbShip.stat.asw === -1) {
      return
    }
    const firepower = statToArray(masterShip.firepower)
    const torpedo = statToArray(masterShip.torpedo)
    const antiAir = statToArray(masterShip.antiAir)
    const armor = statToArray(masterShip.armor)
    const asw = statToArray(masterShip.asw)
    const los = statToArray(masterShip.los)
    const evasion = statToArray(masterShip.evasion)
    const luck = statToArray(masterShip.luck)
    expect(dbShip.stat).toMatchObject({
      fire: firepower[0],
      fire_max: firepower[1],
      torpedo: torpedo[0],
      torpedo_max: torpedo[1],
      aa: antiAir[0],
      aa_max: antiAir[1],
      armor: armor[0],
      armor_max: armor[1],
      asw: asw[0],
      asw_max: asw[1],
      los: los[0],
      los_max: los[1],
      evasion: evasion[0],
      evasion_max: evasion[1],
      luck: luck[0],
      luck_max: luck[1],
    })
  })
}
