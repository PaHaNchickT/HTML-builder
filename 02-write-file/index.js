const fs = require('fs');
const path = require('path');
const way = path.join(__dirname, 'file.txt')
const { stdin, stdout } = process;

fs.writeFile(
    way,
    '',
    err => {
        stdout.write("Введите текст \n");
        stdin.on('data', editData => {
            if (editData.toString().slice(0,4) === 'exit') {
                stdout.write("Прощай, мой друг!");
                process.exit()
            }
            fs.appendFile(
                way,
                editData,
                err => {
                }
            );
        })
    }
);

process.on('SIGINT', () => {
    stdout.write("Прощай, мой друг!");
    process.exit()
});