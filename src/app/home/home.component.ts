import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    isLoading = false;
    contactForm: FormGroup;
    constructor(private electronService: ElectronService,
        private fb: FormBuilder) { }

    async ngOnInit(): Promise<void> {
        const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
        this.contactForm = this.fb.group({
            name: ['', [Validators.required]],
            url: ['', [Validators.required, Validators.pattern(reg)]],
            description: [''],
            isEnabled: true
        });
        // console.log(this.electronService.isElectron);
        await this.electronService.readFileHost();
        this.electronService.dataChangeEvent.subscribe((data) => {
            this.rows = _.cloneDeep(data) || [];
        });
        this.isLoading = true;
        setTimeout(() => {
            this.filter(null);
            this.isLoading = false;
        }, 1000);
    }

    onSubmit(form: FormGroup) {
        console.log('Valid?', form.valid); // true or false
        console.log('value', form.value);
      }

    filter(textSearch) {
        console.log(textSearch);
        this.isLoading = true;
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
        setTimeout(() => {
            this.isLoading = false;
        }, 200);
    }

    openAddDialog() {
        this.contactForm.reset({
            name: '',
            url: '',
            desription: '',
            isEnabled: true
        });
        this.showModal = !this.showModal;
    }
}
