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
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';

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
    InputTextareaModule,
    TableModule,
    ChartModule,
    ProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule
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
    InputTextareaModule,
    TableModule,
    ChartModule,
    ProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule
  ]
})
export class PrimeModulesModule { }
