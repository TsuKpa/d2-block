import { Component, OnInit } from '@angular/core';
import { ElectronService, Site } from '@app/core/services';
import * as _ from 'lodash';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    showModal = false;
    rows: Site[] = [];
    constructor(private electronService: ElectronService) {}

    async ngOnInit(): Promise<void> {
        // console.log(this.electronService.isElectron);
        await this.electronService.findAll();
        await this.electronService.readFileHost();
        this.electronService.dataChangeEvent.subscribe((data) => {
            console.log(data, 'event');
            this.rows = _.cloneDeep(data) || [];
        });
        // this.electronService.create({
        //     name: 'Zalo',
        //     url: 'www.zalo.com',
        //     description: 'www',
        //     isEnabled: true
        // });
    }

    filter() {
        this.rows = _.cloneDeep(this.electronService.dataTables);
    }
}
