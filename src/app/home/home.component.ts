import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElectronService, Site } from '@app/core/services';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

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
    isEdit: boolean;
    isLoadingDialog: boolean;
    currentId: string = null;

    constructor(private electronService: ElectronService,
        private fb: FormBuilder,
        private toastr: ToastrService) { }

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

    async onSubmit(form: FormGroup) {
        console.log('value', form.value);
        console.log(this.isEdit);
        this.isLoadingDialog = true;
        // eslint-disable-next-line curly
        if (this.isEdit && !this.currentId) return;
        if (this.isEdit) {
            await this.electronService.update({
                id: this.currentId,
                ...form.value
            });
            this.toastr.info('Save site success!', '', {
                timeOut: 3000,
            });
        } else {
            await this.electronService.create(form.value);
            this.toastr.success('Add site success!', '', {
                timeOut: 3000,
            });
        }
        this.isLoadingDialog = false;
        this.filter(null);
        this.showModal = !this.showModal;
    }

    filter(textSearch: string) {
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

    openEditDialog(row: Site) {
        console.log(row);
        this.isEdit = true;
        this.showModal = !this.showModal;
        this.currentId = row.id;
        this.contactForm.setValue({
            name: row.name,
            url: row.url,
            description: row.description,
            isEnabled: row.isEnabled
        });
        // this.contactForm.valid
    }

    openAddDialog() {
        this.isEdit = false;
        this.contactForm.reset({
            name: '',
            url: '',
            description: '',
            isEnabled: true
        });
        this.currentId = null;
        this.showModal = !this.showModal;
    }
}
