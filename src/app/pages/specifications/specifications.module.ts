import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecificationsRoutingModule } from './specifications-routing.module';
import { SpecificationsComponent } from './specifications.component';
import { SpecificationsMenuComponent } from './specifications-menu/specifications-menu.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SpecificationsHeaderComponent } from './specifications-header/specifications-header.component';
import { SpecificationsContentComponent } from 'src/app/pages/specifications/specifications-content/specifications-content.component';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';


@NgModule({
  declarations: [
    SpecificationsComponent,
    SpecificationsMenuComponent,
    SpecificationsHeaderComponent,
    SpecificationsContentComponent,
  ],
  imports: [
    CommonModule,
    SpecificationsRoutingModule,
    SharedModule,
    SharedComponentModule
  ]
})
export class SpecificationsModule { }
