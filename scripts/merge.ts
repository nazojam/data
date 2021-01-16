import { ships } from "../src"
import Datastore from "nedb"
import fs from "fs"

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

const mergeData = async () => {
  for (const masterShip of ships) {
    const dbShip = await findShip(masterShip.id)
    if (!dbShip || !dbShip.stat || dbShip.stat.asw === -1) {
      continue
    }
    const dbStat = dbShip.stat
    masterShip.asw = dbStat.asw === dbStat.asw_max ? dbStat.asw : [dbStat.asw, dbStat.asw_max]
    masterShip.los = dbStat.los === dbStat.los_max ? dbStat.los : [dbStat.los, dbStat.los_max]
    masterShip.evasion = dbStat.evasion === dbStat.evasion_max ? dbStat.evasion : [dbStat.evasion, dbStat.evasion_max]
  }

  fs.writeFile("src/json/ships.json", JSON.stringify(ships), console.error)
}

mergeData()
