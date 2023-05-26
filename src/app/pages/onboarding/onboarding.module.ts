import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnboardingComponent } from './onboarding.component';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { BrandGuidelinesComponent } from '../../components/brand-guidelines/brand-guidelines.component';
import { WorkspaceComponent } from '../../components/workspace/workspace.component';
import { AboutYourSelfComponent } from '../../components/about-your-self/about-your-self.component';
import { ExportGetStartedComponent } from '../../components/export-get-started/export-get-started.component';
import { ExportComponent } from '../../components/export/export.component';
import { PrimeModulesModule } from 'src/app/prime-modules/prime-modules.module';


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
        PrimeModulesModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class OnboardingModule { }
