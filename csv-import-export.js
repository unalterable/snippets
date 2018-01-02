const fs = require('fs')
const parseCSV = require('csv-parse/lib/sync')

const getFile = (filePath) => fs.readFileSync(filePath).toString();

const importCsv = (filePath, columnParser) => parseCSV(getFile(filePath), {columns: columnParser})

module.exports = { getFile, importCsv }
