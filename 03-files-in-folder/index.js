const fs = require('fs');
const path = require('path');
const way = path.join(__dirname, 'secret-folder')
const { stdin, stdout } = process;

const files = fs.readdirSync(way,{ withFileTypes: true }, (err) => {})

files.forEach(e => {
    if (e.isFile() === true) {
        let weight = fs.statSync(
            `${way}\\${e.name}`, (err) => { }
        )
        stdout.write(`${e.name.split('.')[0]} - ${e.name.split('.')[1]} - ${(weight.size/1024).toFixed(3)}kb`)
        stdout.write('\n')
    }
})