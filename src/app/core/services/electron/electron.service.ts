import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import * as childProcess from 'child_process';
import { ipcRenderer, webFrame } from 'electron';
import * as fs from 'fs';

@Injectable({
    providedIn: 'root',
})
export class ElectronService {
    ipcRenderer: typeof ipcRenderer;
    webFrame: typeof webFrame;
    childProcess: typeof childProcess;
    fs: typeof fs;

    constructor() {
        // Conditional imports
        if (this.isElectron) {
            this.ipcRenderer = window.require('electron').ipcRenderer;
            this.webFrame = window.require('electron').webFrame;

            this.childProcess = window.require('child_process');
            this.fs = window.require('fs');

            // Notes :
            // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
            // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
            // because it will loaded at runtime by Electron.
            // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
            // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
            // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

            // If you want to use a NodeJS 3rd party deps in Renderer process,
            // ipcRenderer.invoke can serve many common use cases.
            // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
        }
    }

    get isElectron(): boolean {
        return !!(window && window.process && window.process.type);
    }

    findAll() {
        this.ipcRenderer.invoke('find-all').then((data) => {
            console.log('find all sites, received from main:', data);
        });
        // this.fs.readFile(
        //   'c:\\windows\\system32\\drivers\\etc\\hosts',
        //   { encoding: 'utf-8' }, function(err, data) {
        //     if (!err) {
        //       console.log('received data: ' + data);
        //     } else {
        //       console.log(err);
        //     }
        //   }
        // );
    }

    findOne(id: string) {
        this.ipcRenderer.invoke('find-one', id).then((data) => {
            console.log('find one site, received from main:', data);
        });
    }

    create(data: {
        name: string;
        url: string;
        description: string;
        isEnabled: boolean;
    }) {
        this.ipcRenderer.invoke('create', JSON.stringify(data)).then((result) => {
            console.log('create, received from main:', result);
        });
    }

    update(data: {
        id: string;
        name: string;
        url: string;
        description: string;
        isEnabled: boolean;
    }) {
        this.ipcRenderer.invoke('update', data).then((result) => {
            console.log('update, received from main:', result);
        });
    }

    changeStatus(id: string) {
        this.ipcRenderer.invoke('change-status', id).then((data) => {
            console.log('find one site, received from main:', data);
        });
    }
}
