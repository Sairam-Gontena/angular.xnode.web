import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperateRoutingModule } from './operate-routing.module';
import { ButtonModule } from 'primeng/button';
import { OperateComponent } from './operate.component';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  declarations: [
    OperateComponent
  ],
  imports: [
    CommonModule,
    OperateRoutingModule,
    ButtonModule,
    DropdownModule,
    SharedModule,
    AccordionModule
  ]
})
export class OperateModule { }
