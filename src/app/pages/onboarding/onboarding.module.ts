import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnboardingComponent } from './onboarding.component';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { BrandGuidelinesComponent } from './brand-guidelines/brand-guidelines.component';
import { ExportGetStartedComponent } from './export-get-started/export-get-started.component';
import { ExportComponent } from './export/export.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { AboutYourSelfComponent } from 'src/app/pages/onboarding/about-your-self/about-your-self.component';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';


@NgModule({
    declarations: [
        OnboardingComponent,
        BrandGuidelinesComponent,
        WorkspaceComponent,
        AboutYourSelfComponent,
        ExportGetStartedComponent,
        ExportComponent,
    ],
    imports: [
        CommonModule,
        OnboardingRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextareaModule,
        RadioButtonModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class OnboardingModule { }
