import fs from 'fs'
import Datastore from 'nedb'

const itemDatabase = new Datastore({
  filename: 'scripts/WhoCallsTheFleet-DB/db/items.nedb'
})

itemDatabase.loadDatabase(console.error)

itemDatabase.find({ improvable: true }, (err: Error, equipments: any[]) => {
  const improvements = equipments.map(equip => equip.id)
  fs.writeFile('improvements.json', JSON.stringify(improvements), console.error)
})
