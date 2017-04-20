/**
 * Created by maxime on 19/04/17.
 */
const fs = require('fs');

function Parse(store, fn) {
    const fileList = ['./customization/test1/theme.scss.json', './customization/test1/header.json'];
    const associatedReducer = ['OverviewReducer', 'HeaderReducer'];
    let promises = [];

    const AsyncSaveFactory = (store, file, reducer) => {
        return new Promise((res, rej) => {
            fs.open(file, 'w', (err, fd) => {
                if (err) throw err;
                fs.writeFile(fd, JSON.stringify(store[reducer]), (err) => {
                    if (err) {
                        rej();
                        throw err
                    }
                    console.log("File " + file.slice(9) + " was created");
                    res();
                })
            });
        })
    };

    for (let i = 0; i < fileList.length; i++) {
        promises.push(AsyncSaveFactory(store, fileList[i], associatedReducer[i]));
    }

    Promise.all(promises)
        .then(() => { fn(); })
        .catch((err) => { throw err });
}

module.exports = {
    parser: Parse
};