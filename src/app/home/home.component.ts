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
    textSearch = '';
    constructor(private electronService: ElectronService) {}

    async ngOnInit(): Promise<void> {
        // console.log(this.electronService.isElectron);
        await this.electronService.readFileHost();
        this.electronService.dataChangeEvent.subscribe((data) => {
            console.log(data, 'event');
            this.rows = _.cloneDeep(data) || [];
        });
        setTimeout(() => {
            this.filter(null);
        }, 1000);
    }

    filter(textSearch) {
        console.log(textSearch);
        if (textSearch) {
            const rows: Site[] = _.cloneDeep(this.electronService.dataTables);
            this.rows = rows.filter(
                (row) =>
                    row.name.includes(textSearch) ||
                    row.description.includes(textSearch) ||
                    row.url.includes(textSearch)
            );
        } else {
            this.rows = _.cloneDeep(this.electronService.dataTables);
        }
    }
}
