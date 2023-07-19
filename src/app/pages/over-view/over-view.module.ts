import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OverViewRoutingModule } from './over-view-routing.module';
import { OverViewComponent } from './over-view.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ChipModule } from 'primeng/chip';
@NgModule({
  declarations: [
    OverViewComponent,
  ],
  imports: [
    CommonModule,
    OverViewRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    ButtonModule,
    SharedModule,
    DropdownModule,
    ToastModule,
    ChipModule
  ]
})
export class OverViewModule {

}
