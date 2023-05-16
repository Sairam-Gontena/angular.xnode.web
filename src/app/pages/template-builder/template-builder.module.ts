import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateBuilderRoutingModule } from './template-builder-routing.module';
import { TemplateBuilderComponent } from './template-builder.component';
import { GridsterModule } from 'angular-gridster2';



@NgModule({
  declarations: [
    TemplateBuilderComponent
  ],
  imports: [
    CommonModule,
    TemplateBuilderRoutingModule,
    GridsterModule
  ],
  exports: [
    GridsterModule
  ]
})
export class TemplateBuilderModule { }
