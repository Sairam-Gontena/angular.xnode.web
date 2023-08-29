import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { LoginComponent } from './login.component';
import { PasswordModule } from 'primeng/password';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ButtonModule,
    DividerModule,
    PasswordModule,
    FormsModule,
    ReactiveFormsModule,
    MessagesModule,
    CardModule,
    CheckboxModule
  ]
})
export class LoginModule { }
