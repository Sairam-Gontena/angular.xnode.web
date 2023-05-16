import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    DropdownModule
  ],
  exports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    DropdownModule

  ]
})
export class PrimeModulesModule { }
