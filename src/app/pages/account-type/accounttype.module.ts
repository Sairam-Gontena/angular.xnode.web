import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountTypeComponent } from './account-type.component';
import { AccountTypeRoutingModule } from './accounttype-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
@NgModule({
    declarations: [
        AccountTypeComponent,
    ],
    imports: [
        CommonModule,
        AccountTypeRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        PasswordModule,
        DividerModule,
        CheckboxModule,
        DropdownModule,
        RadioButtonModule
    ]
})
export class AccountTypeModule { }
