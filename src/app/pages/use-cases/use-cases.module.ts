import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UseCasesComponent } from './use-cases.component';

import { UseCasesRoutingModule } from './use-cases-routing.module';


@NgModule({
  declarations: [ UseCasesComponent],
  imports: [
    CommonModule,
    UseCasesRoutingModule
  ]
})
export class UseCasesModule { }
