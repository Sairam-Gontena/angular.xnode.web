import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UseCasesComponent } from './use-cases.component';
import { UseCasesRoutingModule } from './use-cases-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';

@NgModule({
  declarations: [UseCasesComponent],
  imports: [
    CommonModule,
    UseCasesRoutingModule,
    SharedModule,
    SharedComponentModule
  ]
})
export class UseCasesModule { }
