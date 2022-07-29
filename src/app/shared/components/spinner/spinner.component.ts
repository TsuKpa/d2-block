import { Component } from '@angular/core';

@Component({
    selector: 'app-spinner',
    template: `
        <span class="spin-circle"></span>
    `,
    styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
    constructor() {}
}
