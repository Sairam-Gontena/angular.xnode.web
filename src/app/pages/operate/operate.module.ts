import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperateRoutingModule } from './operate-routing.module';
import { OperateComponent } from './operate.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
@NgModule({
  declarations: [
    OperateComponent
  ],
  imports: [
    CommonModule,
    OperateRoutingModule,
    SharedModule,
    SharedComponentModule
  ]
})
export class OperateModule { }
