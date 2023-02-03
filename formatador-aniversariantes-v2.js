import { readFile, writeFile } from "fs"
let htmlTextFinal = '<table cellspacing="0" cellpadding="0" align="center" style="margin-top: 50px; width: 600px!important;"> <tbody> <tr> <td align="center">'
const imgDeadline = "https://essentialnutrition-upload-files.s3.amazonaws.com/email/Endomarketing/aniversariantes/"
const imgString = (firstName, lastName) => {
  return `<img style="width: 120px; height: 160px; display: block; margin: 0; border-radius: 10%; border: 1px solid #ab9b6a; "
src="${imgDeadline}${firstName.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}${lastName.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}.jpg"
alt="${firstName} ${lastName}" title="${firstName} ${lastName}" />`
}
const paragraph = (firstName, lastName, sector, local, birthday) => {
  return `<p
  style="text-align: center; font-family: arial, sans-serif; color: #1a1a1a; font-size: 12px; line-height: 18px; margin-bottom: 30px; margin-top: 10px;">
  <b>Dia ${birthday}<br></b>${firstName} ${lastName}<br> ${sector} <br> ${local}
</p>`
}

const writeHtml = () =>
  writeFile("conteudo-final.html", htmlTextFinal.trim(), (error) =>
    error ? new Error(error) : console.log("Script executado com sucesso! Verifique o arquivo conteudo-final.html :)\n")
  )

const upperCaseFormatterName = (text) => text[0].toUpperCase() + text.slice(1)
const upperCaseFormatterSector = (text) =>
  text.length <= 4
    ? text.toUpperCase()
    : text
        .split(" ")
        .map((word) => (word.length > 3 ? upperCaseFormatterName(word.toLowerCase()) : word.toLowerCase()))
        .join(" ")
const upperCaseFormatterLocal = (text) =>
  text.length <= 5
    ? text.toUpperCase()
    : text
        .split(" ")
        .map((word) => (word.length > 3 ? upperCaseFormatterName(word.toLowerCase()) : word.toUpperCase()))
        .join(" ")

const formatText = (text) => {
  const objectPerson = text.split(",,\r\n").map((person) => person.split(",").filter((el) => el !== ""))
  objectPerson.forEach((element) => {
    const [person, birthday, sector, local] = element
    const names = person.split(" ").filter((word) => word !== "")
    const firstName = upperCaseFormatterName(names[0].toLowerCase())
    const lastName = upperCaseFormatterName(names[names.length - 1].toLowerCase())
    const conectorName = names[names.length - 2]?.length === 2 ? names[names.length - 2].toLowerCase() : false
    const sectorName = upperCaseFormatterSector(sector.trim())
      .replace("Injetaveis", "Injetáveis")
      .replace("Liquidos", "Líquidos")
      .replace("Laboratorio", "Laboratório")
      .replace("Hormonios", "Hormônios")
      .replace("Laboratório Injetáveis", "Laboratório de Injetáveis")
      .replace("Laboraório Injetáveis", "Laboratório de Injetáveis")
      .replace("Laboratório Injetáveis", "Laboratório de Injetáveis")
      .replace("LABORATORIO INJETAVEIS", "Laboratório de Injetáveis")
      .replace("Tecnologia da Informação", "T.I.")
      .replace("Pesquisa e Desenvolvimento", "P&D")
    console.log(sectorName)
    const localName = upperCaseFormatterLocal(local.trim())

    htmlTextFinal += `<div style="display: inline-block; width: 140px; vertical-align: top;"> ${imgString(firstName, lastName)}${paragraph(
      firstName,
      conectorName ? `${conectorName} ${lastName}` : lastName,
      sectorName,
      localName,
      Number(birthday.split("/")[0])
    )}</div>`
  })

  htmlTextFinal += "</td></tr></tbody></table>"
  writeHtml()
}

const readCsv = (formatText) => readFile("aniversariantes.csv", "utf-8", (error, text) => (error ? new Error(error) : formatText(text)))

readCsv(formatText)
