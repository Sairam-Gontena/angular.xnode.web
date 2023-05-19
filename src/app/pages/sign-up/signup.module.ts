import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KtdGridModule } from '@katoid/angular-grid-layout';
import { SignUpComponent } from './sign-up.component';
import { SignUpRoutingModule } from './signup-routing.module';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdditionalInfoComponent } from 'src/app/components/additional-info/additional-info.component';
import { PrimeModulesModule } from 'src/app/prime-modules/prime-modules.module';

@NgModule({
    declarations: [
        SignUpComponent,
        AdditionalInfoComponent
    ],
    imports: [
        CommonModule,
        SignUpRoutingModule,
        KtdGridModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        PrimeModulesModule

    ]
})
export class SignUpModule { }
