import { NgModule } from '@angular/core';
import { SpinnerComponent } from './spinner.component';
import { SpinnerDirective } from './spinner.directive';


@NgModule({
  imports: [],
  exports: [SpinnerComponent, SpinnerDirective],
  declarations: [SpinnerComponent, SpinnerDirective],
  entryComponents: [SpinnerComponent],
})
export class SpinnerModule {}
