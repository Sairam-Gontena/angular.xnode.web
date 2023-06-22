import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OverViewRoutingModule } from './over-view-routing.module';
import { OverViewComponent } from './over-view.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { StepComponent } from 'src/app/components/step/step.component';

@NgModule({
  declarations: [
    OverViewComponent,
     StepComponent
  ],
  imports: [
    CommonModule,
    OverViewRoutingModule,
    FlexLayoutModule,
    RatingModule,
    ReactiveFormsModule,
    ButtonModule,


  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OverViewModule {

}
