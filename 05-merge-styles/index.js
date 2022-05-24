const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', err => {
    findingFiles(path.dirname(__filename))
}
);

function findingFiles(way) {
    fs.readdir(way, { withFileTypes: true }, (err, items) => {
        items.forEach(e => {
            if (e.isFile() === true) {
                if (e.name.split('.')[1] === 'css' && e.name !== 'bundle.css') {
                    const input = fs.createReadStream(`${way}\\${e.name}`, 'utf-8');
                    let data = '';
                    input.on('data', chunk => data += chunk);
                    input.on('end', () => {
                        fs.appendFile(`${path.join(__dirname, 'project-dist', 'bundle.css')}`, data, err => { })
                    });
                }
            }
            if (e.isFile() === false && e.name !== 'test-files') {
                findingFiles(`${way}\\${e.name}`)
            }
        })
    })
}