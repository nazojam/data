import fs from "fs"
import { download, formatMaps } from "../piro"

const main = async () => {
  const rawMaps = await download()
  const { ships, formattedMaps } = formatMaps(rawMaps)
  await fs.promises.writeFile("src/json/ships.json", JSON.stringify(ships))
  await fs.promises.writeFile("src/json/formattedMaps.json", JSON.stringify(formattedMaps))
}
main()
