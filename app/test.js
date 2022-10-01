var fs = require('fs');
var mv = require('mv');
const path = 'G:\\Audio';
fs.readdir(path, (err, files) => {
    console.log(files, '*****************');
        for (const item of files) {
            const itemName = item.split('.')[0];
            const pathItem = path + '\\' + itemName + '\\';
            fs.mkdir(`${pathItem}`, err => {
                if (err) throw err;
                console.log(`Create file name: ${itemName} ok` );
                mv(`${path + '\\' + item}`, pathItem + item, err => {
                    if (err) throw err;
                    console.log(`Move file name: ${itemName} success!`);
                })
            })
        }
    if (err) throw err;
});
