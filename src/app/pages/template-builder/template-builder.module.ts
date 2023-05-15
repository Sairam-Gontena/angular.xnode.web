import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateBuilderRoutingModule } from './template-builder-routing.module';
import { TemplateBuilderComponent } from './template-builder.component';


@NgModule({
  declarations: [
    TemplateBuilderComponent
  ],
  imports: [
    CommonModule,
    TemplateBuilderRoutingModule
  ]
})
export class TemplateBuilderModule { }
