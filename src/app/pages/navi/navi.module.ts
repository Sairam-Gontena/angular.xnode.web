import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NaviRoutingModule } from './navi-routing.module';
import { NaviComponent } from './navi.component';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';

@NgModule({
  declarations: [
    NaviComponent
  ],
  imports: [
    CommonModule,
    NaviRoutingModule,
    SharedModule,
    SharedComponentModule
  ]
})
export class NaviModule { }
