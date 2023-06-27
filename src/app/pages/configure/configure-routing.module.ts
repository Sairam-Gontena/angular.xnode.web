import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigureComponent } from './configure.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { OnboardingWorkflowComponent } from './onboarding-workflow/onboarding-workflow.component';
import { LoginWorkflowComponent } from './login-workflow/login-workflow.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigureComponent
  },
  {
    path: 'workflow',
    component: WorkflowComponent
  },
  {
    path: 'onboardingWF',
    component: OnboardingWorkflowComponent
  },
  {
    path: 'loginWF',
    component: LoginWorkflowComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigureRoutingModule { }
