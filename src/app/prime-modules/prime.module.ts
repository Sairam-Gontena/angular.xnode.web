import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MessagesModule } from 'primeng/messages';
import { DragDropModule } from 'primeng/dragdrop';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    DialogModule,
    FileUploadModule,
    RadioButtonModule,
    InputTextareaModule,
    TableModule,
    ChartModule,
    ProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    MessagesModule,
    DragDropModule,
    TableModule,
    ToggleButtonModule,
    BadgeModule
  ],
  exports: [
    CommonModule,
    AccordionModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    DialogModule,
    FileUploadModule,
    RadioButtonModule,
    InputTextareaModule,
    TableModule,
    ChartModule,
    ProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    MessagesModule,
    DragDropModule,
    TableModule,
    ToggleButtonModule,
    BadgeModule
  ]
})
export class PrimeModule { }
