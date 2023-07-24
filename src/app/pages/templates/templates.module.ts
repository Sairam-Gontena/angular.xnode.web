import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesComponent } from './templates.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TemplatesRoutingModule } from './templates-routing.module';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';

@NgModule({
  declarations: [
    TemplatesComponent,
  ],
  imports: [
    CommonModule,
    TemplatesRoutingModule,
    SharedModule,
    SharedComponentModule
  ],
})
export class TemplatesModule { }
