const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const way = path.join(__dirname, 'components')
const out = path.join(__dirname, 'project-dist')
fs.mkdir(out, err => { })
fs.mkdir(path.join(out, 'assets'), err => { })
fs.writeFile(path.join(out, 'index.html'), '', err => { });

///////////////////////////////////////////html/////////////////////////////////////////////

const stream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
let temp = '';
stream.on('data', chunk => temp += chunk);
stream.on('end', () => {
    temp.split('{{').forEach((e, i) => {
        if (i === 0) {
            fs.appendFile(path.join(out, 'index.html'), e, err => {})
        } else {
            const stream = fs.createReadStream(path.join(way, `${e.split('}}')[0]}.html`), 'utf-8');
            let part = ''
            stream.on('data', chunk => part += chunk);
            stream.on('end', () => {
                (async function () {
                    const data = await fs.appendFile(path.join(out, 'index.html'), part+e.split('}}')[1], err => {})
                    console.log(data)
                  })()
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
                    const input = fs.createReadStream(path.join(way, e.name), 'utf-8');
                    let data = '';
                    input.on('data', chunk => data += chunk);
                    input.on('end', () => {
                        fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), data, err => { })
                    });
                }
            }
            if (e.isFile() === false && e.name !== 'test-files') {
                findingFiles(path.join(way, e.name))
            }
        })
    })
}

//////////////////////////////////////assets///////////////////////////////////////

function assetsCopy(way) {
    fs.readdir(way, { withFileTypes: true }, (err, items) => {
        items.forEach(e => {
            if (e.isFile() === true) {
                if (path.join(way, e.name).includes('img') === true) {
                    console.log(`img to ${path.join(way, e.name)}`)
                    console.log(path.join(out, 'assets', 'img'))
                    fs.mkdir(path.join(__dirname, 'project-dist', 'assets', 'img'), err => { })
                    fs.copyFile(
                        path.join(way, e.name),
                        path.join(out, 'assets', 'img', e.name),
                        err => { }
                    )
                }
                if (path.join(way, e.name).includes('fonts') === true) {
                    console.log(`fonts to ${path.join(way, e.name)}`)
                    fs.mkdir(path.join(__dirname, 'project-dist', 'assets', 'fonts'), err => { })
                    fs.copyFile(
                        path.join(way, e.name),
                        path.join(out, 'assets', 'fonts', e.name),
                        err => { }
                    )
                }
                if (path.join(way, e.name).includes('svg') === true) {
                    console.log(`svg to ${path.join(way, e.name)}`)
                    fs.mkdir(path.join(__dirname, 'project-dist', 'assets', 'svg'), err => { })
                    fs.copyFile(
                        path.join(way, e.name),
                        path.join(out, 'assets', 'svg', e.name),
                        err => { }
                    )
                }
                // fs.copyFile(
                //     path.join(way, e.name),
                //     path.join(__dirname, 'project-dist', 'assets', `${`${way}/${e.name}`.split('/')[10]}`, e.name),
                //     err => { }
                // )
            }
            if (e.isFile() === false) {
                assetsCopy(path.join(way, e.name))
            }
        })
    })
}

assetsCopy(path.join(__dirname, 'assets'))