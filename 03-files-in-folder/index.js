const fs = require('fs');
const path = require('path');
const way = path.join(__dirname, 'secret-folder')
const { stdin, stdout } = process;

function findingFiles(way) {
    fs.readdir(way, { withFileTypes: true }, (err, items) => {
        items.forEach(e => {
            if (e.isFile() === true) {
                fs.stat(path.join(__dirname, 'secret-folder', e.name), (err, stat) => {
                    if (e.name.split('.')[0] === '') {
                        stdout.write(`.${e.name.split('.')[1]} - ${(stat.size / 1024).toFixed(3)}kb`)
                    } else {
                        stdout.write(`${e.name.split('.')[0]} - ${e.name.split('.')[1]} - ${(stat.size / 1024).toFixed(3)}kb`)
                    }  
                    stdout.write('\n')
                })
            }
        })
    })
}

findingFiles(way)