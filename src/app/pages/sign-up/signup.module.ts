import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up.component';
import { SignUpRoutingModule } from './signup-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdditionalInfoComponent } from 'src/app/components/additional-info/additional-info.component';
import { PrimeModulesModule } from 'src/app/prime-modules/prime-modules.module';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@NgModule({
    declarations: [
        SignUpComponent,
        AdditionalInfoComponent
    ],
    imports: [
        CommonModule,
        SignUpRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        PrimeModulesModule,
        DividerModule,
        ProgressSpinnerModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SignUpModule { }
