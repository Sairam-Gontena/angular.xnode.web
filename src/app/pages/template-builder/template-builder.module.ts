import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateBuilderComponent } from './template-builder.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { TemplateBuilderRoutingModule } from './template-builder-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
@NgModule({
  declarations: [
    TemplateBuilderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TemplateBuilderRoutingModule,
    DropdownModule,
    InputTextModule,
    ToastModule
  ],
})
export class TemplateBuilderModule { }
