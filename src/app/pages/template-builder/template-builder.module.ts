import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateBuilderComponent } from './template-builder.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { TemplateBuilderRoutingModule } from './template-builder-routing.module';
import { InputTextModule } from 'primeng/inputtext';
@NgModule({
  declarations: [
    TemplateBuilderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TemplateBuilderRoutingModule,
    DropdownModule,
    InputTextModule
  ],
})
export class TemplateBuilderModule { }
