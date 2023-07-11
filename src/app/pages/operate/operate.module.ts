import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperateRoutingModule } from './operate-routing.module';
import { OperateComponent } from './operate.component';
import { OperateLayoutComponent } from 'src/app/components/operate-layout/operate-layout.component';
import { PrimeModulesModule } from 'src/app/prime-modules/prime-modules.module';
import { OperateFeedbackComponent } from 'src/app/components/operate-feedback/operate-feedback.component';
import { AlertComponent } from './alert/alert.component';
import { FeedbackComponent } from './feedback/feedback.component';

@NgModule({
  declarations: [
    OperateLayoutComponent,
    OperateComponent,
    OperateFeedbackComponent,
    AlertComponent,
    FeedbackComponent
  ],
  imports: [
    CommonModule,
    OperateRoutingModule,
    PrimeModulesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OperateModule { }
