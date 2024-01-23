const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const way = path.join(__dirname, 'components');
const out = path.join(__dirname, 'project-dist');
const aboutSec = [];
fs.mkdir(out, (err) => {});
fs.mkdir(path.join(out, 'assets'), (err) => {});
fs.writeFile(path.join(out, 'index.html'), '', (err) => {});
const comp = [];

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

const streamAbout = fs.createReadStream(
  path.join(__dirname, 'template.html'),
  'utf-8',
);

///////////////////////////////////////////html/////////////////////////////////////////////

let tempAbout = '';
streamAbout.on('data', (chunk) => (tempAbout += chunk));
streamAbout.on('end', () => {
  fs.writeFile(
    path.join(__dirname, 'template.html'),
    `${tempAbout.split('{{articles}}')[0]} {{about}} \n    {{articles}} ${
      tempAbout.split('{{articles}}')[1]
    }`,
    (err) => {},
  );

  let names = [];

  fs.promises.readdir(way).then((items) => {
    fs.readFile(
      path.join(__dirname, 'template.html'),
      'utf-8',
      (err, dataHTML) => {
        let filesData = [];

        dataHTML.split('{{').forEach((el, ind) => {
          if (ind === 0) {
            filesData.push(el);
          } else {
            filesData.push(
              fs.promises.readFile(
                path.join(way, `${el.split('}}')[0]}.html`),
                'utf8',
                (err) => {},
              ),
            );
            filesData.push(el.split('}}')[1]);
          }
        });

        Promise.all(filesData).then((data) => {
          fs.promises.writeFile(path.join(out, 'index.html'), data.join(''));
        });
      },
    );
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
