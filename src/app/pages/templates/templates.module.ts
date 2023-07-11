import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplatesRoutingModule } from './templates-routing.module';
import { TemplatesComponent } from './templates.component';
import { PrimeModulesModule } from '../../prime-modules/prime-modules.module';
import { AppHeaderComponent } from 'src/app/components/app-header/app-header.component';
@NgModule({
  declarations: [
    TemplatesComponent,
    AppHeaderComponent
  ],
  imports: [
    CommonModule,
    TemplatesRoutingModule,
    PrimeModulesModule,

  ],
  exports: [
    AppHeaderComponent,

  ]
})
export class TemplatesModule { }
