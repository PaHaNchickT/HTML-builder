const fs = require('fs');
const path = require('path');
const way = path.join(__dirname, 'secret-folder')
const { stdin, stdout } = process;

const files = fs.readdirSync(way, { withFileTypes: true }, (err) => { })

files.forEach(e => {
    if (e.isFile() === true) {
        let weight = fs.statSync(
            `${way}\\${e.name}`, (err) => { }
        )
        if (e.name.split('.')[0] === '') {
            stdout.write(`.${e.name.split('.')[1]} - ${(weight.size / 1024).toFixed(3)}kb`)
        } else {
            stdout.write(`${e.name.split('.')[0]} - ${e.name.split('.')[1]} - ${(weight.size / 1024).toFixed(3)}kb`)
        }
        stdout.write('\n')
    }
    if (e.isFile() === false) {
        fs.readdirSync(`${way}\\${e.name}`, { withFileTypes: true }, (err) => { }).forEach(el => {
            if (el.isFile() === true) {
                let weight = fs.statSync(
                    `${way}\\${e.name}\\${el.name}`, (err) => { }
                )
                if (el.name.split('.')[0] === '') {
                    stdout.write(`.${el.name.split('.')[1]} - ${(weight.size / 1024).toFixed(3)}kb`)
                } else {
                    stdout.write(`${el.name.split('.')[0]} - ${el.name.split('.')[1]} - ${(weight.size / 1024).toFixed(3)}kb`)
                }
                stdout.write('\n')
            }
        })
    }
})