import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { KtdGridModule } from '@katoid/angular-grid-layout';
// input type code
import { InputFormComponent } from 'src/app/components/input-form/input-form.component';
import { InputCheckboxComponent } from 'src/app/components/input-checkbox/input-checkbox.component';
import { InputRadioComponent } from 'src/app/components/input-radio/input-radio.component';
import { InputDropdownComponent } from 'src/app/components/input-dropdown/input-dropdown.component';
import { InputTextComponent } from 'src/app/components/input-text/input-text.component';
import { InputTextareaComponent } from 'src/app/components/input-textarea/input-textarea.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    HomeComponent,
// input type code
    InputTextComponent,
    InputRadioComponent,
    InputCheckboxComponent,
    InputTextareaComponent,
    InputDropdownComponent,
    InputFormComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    KtdGridModule,
// input type code
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    DropdownModule,
    CheckboxModule,
    RadioButtonModule,
     FormsModule, 
     ReactiveFormsModule,
     ButtonModule,

  ]
})
export class HomeModule { }
