import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureRoutingModule } from './configure-routing.module';
import { ConfigureLayoutComponent } from 'src/app/components/configure-layout/configure-layout.component';
import { ConfigureComponent } from './configure.component';
import { PrimeModulesModule } from 'src/app/prime-modules/prime-modules.module';
import { WorkflowComponent } from './workflow/workflow.component';
import { OnboardingWorkflowComponent } from './onboarding-workflow/onboarding-workflow.component';
import { LoginWorkflowComponent } from './login-workflow/login-workflow.component';

@NgModule({
  declarations: [
    ConfigureLayoutComponent,
    ConfigureComponent,
    WorkflowComponent,
    OnboardingWorkflowComponent,
    LoginWorkflowComponent,
  ],
  imports: [
    CommonModule,
    ConfigureRoutingModule,
    PrimeModulesModule
  ],
})

export class ConfigureModule { }
