import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OverViewRoutingModule } from './over-view-routing.module';
import { OverViewComponent } from './over-view.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
@NgModule({
  declarations: [
    OverViewComponent
  ],
  imports: [
    CommonModule,
    OverViewRoutingModule,
    FlexLayoutModule,
    RatingModule,
    ReactiveFormsModule,
    ButtonModule
  ]
})
export class OverViewModule { }
