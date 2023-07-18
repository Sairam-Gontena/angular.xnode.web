import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up.component';
import { SignUpRoutingModule } from './signup-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { PrimeModule } from 'src/app/prime-modules/prime.module';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';

import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
@NgModule({
    declarations: [
        SignUpComponent,
    ],
    imports: [
        CommonModule,
        SignUpRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        // PrimeModule,
        ButtonModule,
        PasswordModule,
        DividerModule,
        GoogleSigninButtonModule
    ]
})
export class SignUpModule { }
