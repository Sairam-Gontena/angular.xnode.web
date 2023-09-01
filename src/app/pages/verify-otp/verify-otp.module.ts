import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifyOtpRoutingModule } from './verify-otp-routing.module';
import { VerifyOtpComponent } from './verify-otp.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { FieldsetModule } from 'primeng/fieldset';


@NgModule({
  declarations: [
    VerifyOtpComponent
  ],
  imports: [
    CommonModule,
    VerifyOtpRoutingModule,
    ButtonModule,
    DividerModule,
    PasswordModule,
    FormsModule,
    ReactiveFormsModule,
    MessagesModule,
    CardModule,
    CheckboxModule,
    NgOtpInputModule,
    FieldsetModule
  ]
})
export class VerifyOtpModule { }
