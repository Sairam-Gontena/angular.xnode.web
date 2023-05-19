import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KtdGridModule } from '@katoid/angular-grid-layout';

import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WelcomeComponent } from './welcome.component';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { CardModule } from 'primeng/card';


@NgModule({
    declarations: [
        WelcomeComponent
    ],
    imports: [
        CommonModule,
        WelcomeRoutingModule,
        KtdGridModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        CardModule

    ]
})
export class WelcomeModule { }
