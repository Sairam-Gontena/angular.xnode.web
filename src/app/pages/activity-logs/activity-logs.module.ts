import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityLogsRoutingModule } from './activity-logs-routing.module';
import { ActivityLogsComponent } from './activity-logs.component';


@NgModule({
  declarations: [
    ActivityLogsComponent
  ],
  imports: [
    CommonModule,
    ActivityLogsRoutingModule
  ]
})
export class ActivityLogsModule { }
