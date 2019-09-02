import { ships, ShipStat } from "../src"
import Datastore from "nedb"

const shipDatabase = new Datastore({
  filename: "scripts/WhoCallsTheFleet-DB/db/ships.nedb"
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
    const asw = statToArray(masterShip.asw)
    const los = statToArray(masterShip.los)
    const evasion = statToArray(masterShip.evasion)
    expect(dbShip.stat).toMatchObject({
      asw: asw[0],
      asw_max: asw[1],
      los: los[0],
      los_max: los[1],
      evasion: evasion[0],
      evasion_max: evasion[1]
    })
  })
}
