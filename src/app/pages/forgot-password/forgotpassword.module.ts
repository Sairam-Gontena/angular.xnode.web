import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ForgotPasswordRoutingModule } from './forgotpassword-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';


@NgModule({
    declarations: [
        ForgotPasswordComponent,
    ],
    imports: [
        CommonModule,
        ForgotPasswordRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        PasswordModule,
        DividerModule,
        CheckboxModule,
        DropdownModule,
        RadioButtonModule,
        CardModule
    ]
})
export class ForgotPasswordModule { }
