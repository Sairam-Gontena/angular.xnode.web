import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperateRoutingModule } from './operate-routing.module';
import { OperateComponent } from './operate.component';
import { OperateLayoutComponent } from 'src/app/components/operate-layout/operate-layout.component';
import { PrimeModulesModule } from 'src/app/prime-modules/prime-modules.module';
import { OperateFeedbackComponent } from 'src/app/components/operate-feedback/operate-feedback.component';

@NgModule({
  declarations: [
    OperateLayoutComponent,
    OperateComponent,
    OperateFeedbackComponent
  ],
  imports: [
    CommonModule,
    OperateRoutingModule,
    PrimeModulesModule
  ]
})
export class OperateModule { }
