const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

fs.mkdir(
    path.join(__dirname, 'files-copy'),
    err => {
        fs.readdir(path.join(__dirname, 'files-copy'), (err, items) => {
            items.forEach(e => {
                fs.unlink(path.join(__dirname, 'files-copy', e), err => {})
            })
        })
        fs.readdir(path.join(__dirname, 'files'),{ withFileTypes: true }, (err, items) => {
            items.forEach(e => {
                fs.copyFile(
                    path.join(__dirname, 'files', e.name),
                    path.join(__dirname, 'files-copy', e.name),
                    err => {}
                )  
            })
        })
    }
)