import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KtdGridModule } from '@katoid/angular-grid-layout';
import { SignUpComponent } from './sign-up.component';
import { SignUpRoutingModule } from './signup-routing.module';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        SignUpComponent
    ],
    imports: [
        CommonModule,
        SignUpRoutingModule,
        KtdGridModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule

    ]
})
export class SignUpModule { }
