import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerificationRoutingModule } from './verification-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { VerificationComponent } from './verification.component';
import { NgOtpInputModule } from  'ng-otp-input';


@NgModule({
  declarations: [
    VerificationComponent
  ],
  imports: [
    CommonModule,
    VerificationRoutingModule,
    ButtonModule,
    DividerModule,
    PasswordModule,
    FormsModule,
    ReactiveFormsModule,
    MessagesModule,
    CardModule,
    CheckboxModule,
    NgOtpInputModule
  ]
})
export class VerificationModule { }
