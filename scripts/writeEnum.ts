import fs from "fs"

export const writeEnum = (fileName: string, enumName: string, data: [string, number][], isConst = true) => {
  const names = data.map(([name]) => name)
  const duplicatedNames = names.filter(name => names.indexOf(name) !== names.lastIndexOf(name))

  let inner = ""
  let isFirst = true
  data.forEach(([name, value]) => {
    const key = duplicatedNames.includes(name) ? `${name} id${value}` : name
    const line = `${isFirst ? "" : ","}\r\n  "${key}" = ${value}`
    isFirst = false
    inner += line
  })

  const text = `export${isConst ? " const" : ""} enum ${enumName} {${inner}\r\n}\r\n`
  fs.writeFile(fileName, text, console.error)
}
