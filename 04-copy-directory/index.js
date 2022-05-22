const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

fs.mkdir(
    path.join(__dirname, 'files-copy'),
    err => {}
)

const files = fs.readdirSync(path.join(__dirname, 'files'),{ withFileTypes: true }, (err) => {})
files.forEach(e => {
    fs.copyFile(
        path.join(__dirname, 'files', e.name),
        path.join(__dirname, 'files-copy', e.name),
        err => {}
    )  
})