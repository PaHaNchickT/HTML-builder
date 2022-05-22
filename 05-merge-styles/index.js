const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

function findingFiles(way) {
    fs.readdirSync(way, { withFileTypes: true }, (err) => { }).forEach(e => {
        if (e.isFile() === true) {
            let weight = fs.statSync(`${way}\\${e.name}`, (err) => {})
            stdout.write(`${e.name.split('.')[0]} - ${e.name.split('.')[1]} - ${(weight.size / 1024).toFixed(3)}kb`)
            stdout.write('\n')
        }
        if (e.isFile() === false) {
            findingFiles(`${way}\\${e.name}`)
        }
    })
}

findingFiles(path.dirname(__filename))