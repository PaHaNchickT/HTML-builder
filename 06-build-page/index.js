const fs = require('fs');
const path = require('path');
const way = path.join(__dirname, 'components')
const out = path.join(__dirname, 'project-dist')

fs.mkdir(out, err => { })
fs.mkdir(`${out}\\assets`, err => { })
fs.writeFile(`${out}\\index.html`, '', err => { });

///////////////////////////////////////////html/////////////////////////////////////////////

const stream = fs.createReadStream(`${__dirname}\\template.html`, 'utf-8');

let temp = '';
stream.on('data', chunk => temp += chunk);
stream.on('end', () => {
    temp.split('{{').forEach((e, i) => {
        if (i === 0) {
            fs.appendFile(`${out}\\index.html`, e, err => { })
        } else {
            const stream = fs.createReadStream(`${way}\\${e.split('}}')[0]}.html`, 'utf-8');
            let part = ''
            stream.on('data', chunk => part += chunk);
            stream.on('end', () => {
                fs.appendFile(`${out}\\index.html`, part, err => { })
                fs.appendFile(`${out}\\index.html`, e.split('}}')[1], err => { })
            })
        }
    })
});

///////////////////////////////////////////css/////////////////////////////////////

fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), '', err => {
    findingFiles(path.dirname(__filename))
}
);

function findingFiles(way) {
    fs.readdir(way, { withFileTypes: true }, (err, items) => {
        items.forEach(e => {
            if (e.isFile() === true) {
                if (e.name.split('.')[1] === 'css' && e.name !== 'style.css') {
                    const input = fs.createReadStream(`${way}\\${e.name}`, 'utf-8');
                    let data = '';
                    input.on('data', chunk => data += chunk);
                    input.on('end', () => {
                        fs.appendFile(`${path.join(__dirname, 'project-dist', 'style.css')}`, data, err => { })
                    });
                }
            }
            if (e.isFile() === false && e.name !== 'test-files') {
                findingFiles(`${way}\\${e.name}`)
            }
        })
    })
}

//////////////////////////////////////assets///////////////////////////////////////

function assetsCopy(way) {
    fs.readdir(way, { withFileTypes: true }, (err, items) => {
        items.forEach(e => {
            if (e.isFile() === true) {
                fs.mkdir(path.join(__dirname, 'project-dist' , 'assets', `${`${way}\\${e.name}`.split('\\')[10]}`), err => { })
                fs.copyFile(
                    `${way}\\${e.name}`,
                    path.join(__dirname, 'project-dist', 'assets', `${`${way}\\${e.name}`.split('\\')[10]}`, e.name),
                    err => { }
                )
            }
            if (e.isFile() === false) {
                assetsCopy(`${way}\\${e.name}`)
            }
        })
    })
}

assetsCopy(path.join(__dirname, 'assets'))