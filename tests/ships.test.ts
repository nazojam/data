import { ships } from '../src'
import Datastore from 'nedb'

const shipDatabase = new Datastore({
  filename: 'scripts/WhoCallsTheFleet-DB/db/ships.nedb'
})

shipDatabase.loadDatabase(console.error)

const findShip = async (id: number) =>
  new Promise<any>((resolve, reject) =>
    shipDatabase.findOne({ id }, (err, ship: any) => {
      resolve(ship)
      reject(err)
    })
  )

for (const masterShip of ships) {
  it(masterShip.name, async () => {
    const ship = await findShip(masterShip.id)
    if (!ship || !ship.stat || ship.stat.asw === -1) {
      return
    }
    const { asw, los, evasion } = masterShip
    if (typeof asw !== 'number') {
      expect(ship.stat.asw).toBe(asw[0])
      expect(ship.stat.asw_max).toBe(asw[1])
    }
    if (typeof los !== 'number') {
      expect(ship.stat.los).toBe(los[0])
      expect(ship.stat.los_max).toBe(los[1])
    }
    if (typeof evasion !== 'number') {
      expect(ship.stat.evasion).toBe(evasion[0])
      expect(ship.stat.evasion_max).toBe(evasion[1])
    }
  })
}
