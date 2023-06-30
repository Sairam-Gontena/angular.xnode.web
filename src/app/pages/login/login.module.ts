import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeModulesModule } from 'src/app/prime-modules/prime-modules.module';
import { DividerModule } from 'primeng/divider';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginRoutingModule,
    PrimeModulesModule,
    DividerModule

  ]
})
export class LoginModule { }
