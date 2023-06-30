import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeModulesModule } from 'src/app/prime-modules/prime-modules.module';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginRoutingModule,
    PrimeModulesModule,
    DividerModule,
    // PasswordModule,

  ]
})
export class LoginModule { }
