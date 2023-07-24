import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NaviRoutingModule } from './navi-routing.module';
import { NaviComponent } from './navi.component';

@NgModule({
  declarations: [
    NaviComponent
  ],
  imports: [
    CommonModule,
    NaviRoutingModule,
    SharedModule
  ]
})
export class NaviModule { }
