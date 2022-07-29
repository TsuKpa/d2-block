/* eslint-disable @typescript-eslint/member-ordering */
import {
    ComponentFactoryResolver,
    ComponentFactory,
    ComponentRef,
    Directive,
    ElementRef,
    Input,
    OnInit,
    Renderer2,
    ViewContainerRef,
    HostBinding,
} from '@angular/core';
import { SpinnerComponent } from './spinner.component';

@Directive({ selector: '[Spinner]' })
export class SpinnerDirective implements OnInit {
    private shouldShow = false;
    spinner: ComponentRef<SpinnerComponent>;
    componentFactory: ComponentFactory<SpinnerComponent>;

    /**
     * Directive value - show or hide spinner
     *
     * @param val
     */
    @Input('Spinner')
    set nbSpinner(val: boolean) {
        if (this.componentFactory) {
            if (val) {
                this.show();
            } else {
                this.hide();
            }
        } else {
            this.shouldShow = val;
        }
    }

    @HostBinding('class.spinner-container') isSpinnerExist = false;

    constructor(
        private directiveView: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private renderer: Renderer2,
        private directiveElement: ElementRef
    ) {}

    ngOnInit() {
        this.componentFactory =
            this.componentFactoryResolver.resolveComponentFactory(
                SpinnerComponent
            );
        if (this.shouldShow) {
            this.show();
        }
    }

    hide() {
        if (this.isSpinnerExist) {
            this.directiveView.remove();
            this.isSpinnerExist = false;
        }
    }

    show() {
        if (!this.isSpinnerExist) {
            this.spinner = this.directiveView.createComponent<SpinnerComponent>(
                this.componentFactory
            );
            this.spinner.changeDetectorRef.detectChanges();
            this.renderer.appendChild(
                this.directiveElement.nativeElement,
                this.spinner.location.nativeElement
            );
            this.isSpinnerExist = true;
        }
    }
}
