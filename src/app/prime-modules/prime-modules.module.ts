import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    AccordionModule,
    DialogModule,
    FileUploadModule,
    RadioButtonModule,
    InputTextareaModule
  ],
  exports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    AccordionModule,
    DialogModule,
    FileUploadModule,
    RadioButtonModule,
    InputTextareaModule
  ]
})
export class PrimeModulesModule { }
