import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UseCasesComponent } from './use-cases.component';
import { UseCasesRoutingModule } from './use-cases-routing.module';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
// import { PrimeModule } from 'src/app/prime-modules/prime.module';

@NgModule({
  declarations: [UseCasesComponent],
  imports: [
    CommonModule,
    UseCasesRoutingModule,
    // PrimeModule,
    ButtonModule,
    DropdownModule,
    ProgressSpinnerModule
  ]
})
export class UseCasesModule { }
