import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UseCasesComponent } from './use-cases.component';
import { UseCasesRoutingModule } from './use-cases-routing.module';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [UseCasesComponent],
  imports: [
    CommonModule,
    UseCasesRoutingModule,
    SharedModule,
    ButtonModule,
    DropdownModule,
    ProgressSpinnerModule,
    ToastModule
  ]
})
export class UseCasesModule { }
