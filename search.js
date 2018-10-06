
const path = require('path');
const fs = require('fs');

const searchfiles = (currentPath, ext, filterString) => {
    if(!fs.existsSync(currentPath)) {
        console.log(`Specified directory: ${currentPath} does not exist`);
        return;
    }

    const found = getFiles(currentPath, ext);
    if(found.length == 0) {
        console.log(`No file was found`);
        return;
    }

    let count = 0;

    found.forEach(file => {
        const fileContent = fs.readFileSync(file);

        const regex = new RegExp('\\b' + filterString + '\\b');
        if (regex.test(fileContent)) {
            console.log(file);
            count++;
        }
    });

    if (count == 0){
        console.log(`No file was found`);
        return;
    }
}

const getFiles = (currentPath, ext) => {
    if(!fs.existsSync(currentPath)) {
        console.log(`Specified directory: ${currentPath} does not exist`);
        return;
    }

    let filesFound = [];
    fs.readdirSync(currentPath).forEach(file => {
        const filePath = path.join(currentPath, file);
        const statusFile = fs.lstatSync(filePath);

        if (statusFile.isDirectory()) {   // the file is directory
            const nestedFiles = getFiles(filePath, ext);
            filesFound = filesFound.concat(nestedFiles);
        } else {  // is a file ,add it to the array of filesFound
            if (path.extname(file) == `.${ext}`) {
                filesFound.push(filePath);
            }
        }
    });

    return filesFound;
}

if(process.argv[2] == null || process.argv[3] == null) {
    console.log(`USAGE: node search [EXT] [TEXT]`);
} else {
    searchfiles(__dirname, process.argv[2], process.argv[3]);
}