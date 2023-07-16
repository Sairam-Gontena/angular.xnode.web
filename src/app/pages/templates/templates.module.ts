import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesComponent } from './templates.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TemplatesRoutingModule } from './templates-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    TemplatesComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    TemplatesRoutingModule,
    CardModule,
    DropdownModule,
    SharedModule,
    ProgressSpinnerModule,
    ToastModule,
  ],
})
export class TemplatesModule { }
