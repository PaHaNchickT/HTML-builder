const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const fss = require('fs/promises');
const way = path.join(__dirname, 'components');
const out = path.join(__dirname, 'project-dist');
fs.mkdir(out, (err) => {});
fs.mkdir(path.join(out, 'assets'), (err) => {});
fs.writeFile(path.join(out, 'index.html'), '', (err) => {});

////////////////////////////////////////test files//////////////////////////////////////////

const testWay = path.join(__dirname, 'test-files');
fs.readdir(testWay, (err, items) => {
  items.forEach((subFold) => {
    fs.readdir(path.join(testWay, subFold), (err, itms) => {
      let outSubFold = subFold;
      itms.forEach((fileName) => {
        if (subFold === 'images') outSubFold = path.join('assets', 'img');
        fs.copyFile(
          path.join(testWay, subFold, fileName),
          path.join(__dirname, outSubFold, fileName),
          (err) => {},
        );
      });
    });
  });
});

function editTemplate() {
  const stream = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  let temp = '';
  stream.on('data', (chunk) => (temp += chunk));
  stream.on('end', () => {
    temp.split('{{articles}}').forEach((e, i) => {
      if (i === 0) {
        fss.writeFile(
          path.join(__dirname, 'template.html'),
          `${e} {{about}} \n    {{articles}}`,
          (err) => {},
        );
      } else {
        fss.appendFile(path.join(__dirname, 'template.html'), e, (err) => {});
      }
    });
  });
}

editTemplate();

///////////////////////////////////////////html/////////////////////////////////////////////

const stream = fs.createReadStream(
  path.join(__dirname, 'template.html'),
  'utf-8',
);
let temp = '';
stream.on('data', (chunk) => (temp += chunk));
stream.on('end', () => {
  temp.split('{{').forEach((e, i) => {
    if (i === 0) {
      fs.appendFile(path.join(out, 'index.html'), e, (err) => {});
    } else {
      const stream = fs.createReadStream(
        path.join(way, `${e.split('}}')[0]}.html`),
        'utf-8',
      );
      let part = '';
      stream.on('data', (chunk) => (part += chunk));
      stream.on('end', () => {
        (async function () {
          const data = await fss.appendFile(
            path.join(out, 'index.html'),
            part + e.split('}}')[1],
            (err) => {},
          );
        })();
      });
    }
  });
});

///////////////////////////////////////////css/////////////////////////////////////

fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), '', (err) => {
  findingFiles(path.dirname(__filename));
});

function findingFiles(way) {
  fs.readdir(way, { withFileTypes: true }, (err, items) => {
    items.forEach((e) => {
      if (e.isFile() === true) {
        if (e.name.split('.')[1] === 'css' && e.name !== 'style.css') {
          const input = fs.createReadStream(path.join(way, e.name), 'utf-8');
          let data = '';
          input.on('data', (chunk) => (data += chunk));
          input.on('end', () => {
            fs.appendFile(
              path.join(__dirname, 'project-dist', 'style.css'),
              data,
              (err) => {},
            );
          });
        }
      }
      if (e.isFile() === false && e.name !== 'test-files') {
        findingFiles(path.join(way, e.name));
      }
    });
  });
}

//////////////////////////////////////assets///////////////////////////////////////

function assetsCopy(way) {
  fs.readdir(way, { withFileTypes: true }, (err, items) => {
    items.forEach((e) => {
      if (e.isFile() === true) {
        if (path.join(way, e.name).includes('img') === true) {
          fs.mkdir(
            path.join(__dirname, 'project-dist', 'assets', 'img'),
            (err) => {},
          );
          fs.copyFile(
            path.join(way, e.name),
            path.join(out, 'assets', 'img', e.name),
            (err) => {},
          );
        }
        if (path.join(way, e.name).includes('fonts') === true) {
          fs.mkdir(
            path.join(__dirname, 'project-dist', 'assets', 'fonts'),
            (err) => {},
          );
          fs.copyFile(
            path.join(way, e.name),
            path.join(out, 'assets', 'fonts', e.name),
            (err) => {},
          );
        }
        if (path.join(way, e.name).includes('svg') === true) {
          fs.mkdir(
            path.join(__dirname, 'project-dist', 'assets', 'svg'),
            (err) => {},
          );
          fs.copyFile(
            path.join(way, e.name),
            path.join(out, 'assets', 'svg', e.name),
            (err) => {},
          );
        }
      }
      if (e.isFile() === false) {
        assetsCopy(path.join(way, e.name));
      }
    });
  });
}

assetsCopy(path.join(__dirname, 'assets'));
