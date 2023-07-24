import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateBuilderComponent } from './template-builder.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TemplateBuilderRoutingModule } from './template-builder-routing.module';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
@NgModule({
  declarations: [
    TemplateBuilderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TemplateBuilderRoutingModule,
    SharedComponentModule
  ],
})
export class TemplateBuilderModule { }
