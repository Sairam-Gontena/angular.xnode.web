import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UseCasesComponent } from './use-cases.component';

import { UseCasesRoutingModule } from './use-cases-routing.module';
import { PrimeModulesModule } from 'src/app/prime-modules/prime-modules.module';


@NgModule({
  declarations: [UseCasesComponent],
  imports: [
    CommonModule,
    UseCasesRoutingModule,
    PrimeModulesModule
  ]
})
export class UseCasesModule { }
