import fs from "fs"
import Datastore from "nedb"

const itemDatabase = new Datastore({
  filename: "scripts/WhoCallsTheFleet-DB/db/items.nedb"
})

itemDatabase.loadDatabase(console.error)

itemDatabase.find({ improvable: true }, (err: Error, equipments: any[]) => {
  const improvableIds = equipments.map(equip => equip.id)
  fs.writeFile("src/json/improvableIds.json", JSON.stringify(improvableIds), console.error)
})
