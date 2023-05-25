import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KtdGridModule } from '@katoid/angular-grid-layout';

import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { OnboardingComponent } from './onboarding.component';
import { FileUploadModule } from 'primeng/fileupload';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { BrandGuidelinesComponent } from '../../components/brand-guidelines/brand-guidelines.component';
import { WorkspaceComponent } from '../../components/workspace/workspace.component';
import { AboutYourSelfComponent } from '../../components/about-your-self/about-your-self.component';
import { ExportGetStartedComponent } from '../../components/export-get-started/export-get-started.component';
import { ExportComponent } from '../../components/export/export.component';


@NgModule({
    declarations: [
        OnboardingComponent,
        BrandGuidelinesComponent,
        WorkspaceComponent,
        AboutYourSelfComponent,
        ExportGetStartedComponent,
        ExportComponent
    ],
    imports: [
        CommonModule,
        OnboardingRoutingModule,
        KtdGridModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        CardModule,
        FileUploadModule,
        RadioButtonModule,
        InputTextareaModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class OnboardingModule { }
