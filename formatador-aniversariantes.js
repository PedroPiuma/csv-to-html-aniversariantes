import { readFile, writeFile } from 'fs'
let htmlTextFinal = '<table>'
let htmlTextImages = ''
let htmlTextInfos = ''
const thisYear = new Date().getFullYear()
const writeHtml = () => writeFile('conteudo-final.html', htmlTextFinal.trim(), error => error ? new Error(error) : console.log('Script executado com sucesso! Verifique o arquivo conteudo-final.html :)\n'))
const readCsv = formatText => readFile('aniversariantes.csv', 'utf-8', (error, text) => error ? new Error(error) : formatText(text))
const createPhoto = (firstName, lastName) => `<td width="150"><img style="width: 120px; height: 160px; display: block; margin-left: auto; margin-right: auto; border-radius: 10%; border: 1px solid; border-color: #ab9b6a;" src="https://arquivos.essentialnutrition.com.br/images/aniversarios/${thisYear}/julho/${firstName}${lastName}.jpg" alt="" /></td>`
const createPersonDescription = (firstName, lastName, sector, local, birthday) => `<td width="150"><p style="text-align: center; font-family: arial, sans-serif; color: #1a1a1a; font-size: 12px; line-height: 18px; margin-bottom: 30px;"><b>Dia ${birthday}<br /></b>${firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, "")} ${lastName.normalize('NFD').replace(/[\u0300-\u036f]/g, "")}<br /> ${sector} <br /> ${local}</p></td>`
const upperCaseFormatterName = text => text[0]?.toUpperCase() + text.slice(1)
const upperCaseFormatterSector = text => text.length <= 3 ? text : text.split(' ').map(word => upperCaseFormatterName(word.toLowerCase())).join(' ')
const upperCaseFormatterLocal = text => text.length <= 5 ? text.toUpperCase() : text.split(' ').map(word => word.length > 3 ? upperCaseFormatterName(word.toLowerCase()) : word.toUpperCase()).join(' ')

const formatText = text => {
    const objectPerson = text.split(',,\r\n').map(person => person.split(',').filter(el => el !== ''))
    const createRows = () => objectPerson.map((el, index) => {
        const [person, birthday, sector, local] = el
        const firstName = upperCaseFormatterName(person.split(' ').shift().toLowerCase())
        const lastName = upperCaseFormatterName(person.split(' ').pop().toLowerCase())
        const sectorName = upperCaseFormatterSector(sector)
        const localName = upperCaseFormatterLocal(local)
        if (index === 0) {
            htmlTextImages += '<tr>'
            htmlTextInfos += '<tr>'
        }
        htmlTextImages += createPhoto(firstName, lastName)
        htmlTextInfos += createPersonDescription(firstName, lastName, sectorName, localName, Number(birthday.slice(0, 2)))
        if ((index + 1) % 4 === 0 && index !== objectPerson.length - 1) {
            htmlTextImages += '</tr>|<tr>'
            htmlTextInfos += '</tr>|<tr>'
        }
        if (index === objectPerson.length - 1) {
            htmlTextInfos += '</tr>'
            htmlTextImages += '</tr>'
        }
    })

    const matchRows = () => {
        createRows()
        const imageRows = htmlTextImages.split('|')
        const descriptionRows = htmlTextInfos.split('|')
        const numberOfRows = imageRows.length === descriptionRows.length ? imageRows.length : new Error('Image rows length is diferent of description rows length.')
        for (let i = 0; i < numberOfRows; i++) { htmlTextFinal += imageRows[i] + descriptionRows[i] }
    }
    matchRows()
    htmlTextFinal += '</table>'
    writeHtml()
}
readCsv(formatText)
