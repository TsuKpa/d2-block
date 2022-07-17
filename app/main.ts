const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const url = require('url');
const _ = require('lodash');

const { join } = require('path');

let win = null;
const args = process.argv.slice(1),
    serve = args.some((val) => val === '--serve');

function createWindow() {
    const electronScreen = require('electron').screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    win = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: serve ? true : false,
            contextIsolation: false, // false if you want to run e2e test with Spectron
        },
    });

    if (serve) {
        const debug = require('electron-debug');
        debug();

        require('electron-reloader')(module);
        win.loadURL('http://localhost:4200');
    } else {
        // Path when running electron executable
        let pathIndex = './index.html';

        if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
            // Path when running electron in local folder
            pathIndex = '../dist/index.html';
        }

        win.loadURL(
            url.format({
                pathname: path.join(__dirname, pathIndex),
                protocol: 'file:',
                slashes: true,
            })
        );
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    return win;
}

const uuid = () =>
    String(Date.now().toString(32) + Math.random().toString(16)).replace(
        /\./g,
        ''
    );

try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    app.on('ready', async () => {
        setTimeout(createWindow, 400);

        const low = require('lowdb');
        const FileSync = require('lowdb/adapters/FileSync');
        const adapter = new FileSync('database.json');
        const db = low(adapter);

        // read data before using
        await db.read();

        // Set some defaults (required if your JSON file is empty)
        db.defaults({ sites: [] }).write();

        const isExistId = (id: string): boolean => {
            if (!id) throw new Error('Invalid Id');
            const site = db.get('sites').find({ id }).value();
            return !!site;
        };

        const isExistUrl = (text: string): boolean => {
            if (!text) throw new Error('Invalid Id');
            text = text.toLowerCase();
            const site = db.get('sites').find({ url: text }).value();
            return !!site;
        };

        const create = (event, data: string) => {
            const site: {
                id?: string;
                name: string;
                url: string;
                description: string;
                isEnabled: boolean;
            } = JSON.parse(data);
            if (_.isObject(site)) {
                site.id = uuid();
                const result = db.get('sites').push(site).write();
                return result;
            }
            return null;
        }

        // Handle query
        ipcMain.handle('read-file-host', (event, rows: string[]) => {
            console.log(rows);

            if (!_.isArray(rows)) throw new Error('Invalid array!');
            for (let row of rows) {
                row = row.toLowerCase();
                if (!isExistUrl(row)) {
                    let stringData = JSON.stringify({
                        name: row,
                        url: row,
                        description: '',
                        isEnabled: true
                    });
                    create(new Event('load'), stringData);
                }
            }
            const result = db.get('sites').value();
            return result || [];
        });

        ipcMain.handle('find-all', (event) => {
            const result = db.get('sites').value();
            return result || [];
        });

        ipcMain.handle('find-one', (event, id: string) => {
            if (!id) return null;
            const site = db.get('sites').find({ id }).value();
            return site || null;
        });

        ipcMain.handle('create', create);

        ipcMain.handle('update', (event, data: string) => {
            const site: {
                id: string;
                name: string;
                url: string;
                description: string;
                isEnabled: boolean;
            } = JSON.parse(data);
            if (!isExistId(site.id)) throw new Error('id not exist');
            if (_.isObject(site)) {
                db.get('posts').find({ id: site.id }).assign(site).write();
            }
            return null;
        });

        ipcMain.handle('change-status', (event, id: string) => {
            if (!isExistId(id)) throw new Error('id not exist');
            const site = db.get('posts').find({ id }).value();
            site.isEnabled = !site.isEnabled;
            return site.write();
        });
    });

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
} catch (e) {
    // Catch Error
    throw e;
}
