import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    AccordionModule
  ],
  exports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    AccordionModule

  ]
})
export class PrimeModulesModule { }
