import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './src/app/pages/page-not-found/page-not-found.component';
import { SignupDynamicFormComponent } from './components/form-builder/signup-dynamic-form/signup-dynamic-form.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/account-type/accounttype.module').then((m) => m.AccountTypeModule),
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./pages/sign-up/signup.module').then((m) => m.SignUpModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'verification',
    loadChildren: () => import('./pages/verification/verification.module').then((m) => m.VerificationModule)
  },
  {
    path: 'usecases',
    loadChildren: () =>
      import('./pages/use-cases/use-cases.module').then(
        (m) => m.UseCasesModule
      ),
  },
  {
    path: 'publish',
    loadChildren: () =>
      import('./pages/publish/publish.module').then((m) => m.PublishModule),
  },
  {
    path: 'configuration/api-integration',
    loadChildren: () =>
      import('./pages/configure/configure.module').then(
        (m) => m.ConfigureModule
      ),
  },
  {
    path: 'overview',
    loadChildren: () =>
      import('./pages/overview/overview.module').then((m) => m.OverViewModule),
  },
  {
    path: 'my-products',
    loadChildren: () =>
      import('./pages/my-products/my-products.module').then(
        (m) => m.MyProductsModule
      ),
  },
  {
    path: 'acitvity',
    loadChildren: () =>
      import('./pages/activity-logs/activity-logs.module').then(
        (m) => m.ActivityLogsModule
      ),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/template-builder/template-builder.module').then(
        (m) => m.TemplateBuilderModule
      ),
  },
  {
    path: 'sample',
    loadChildren: () =>
      import('./pages/sample/sample.module').then((m) => m.SampleModule),
  },
  {
    path: 'operate',
    loadChildren: () =>
      import('./pages/operate/operate.module').then((m) => m.OperateModule),
  },
  {
    path: 'configuration/data-model/overview',
    loadChildren: () =>
      import('./pages/er-modeller/er-modeller.module').then(
        (m) => m.ErModellerModule
      ),
  },
  {
    path: 'workspace',
    loadChildren: () =>
      import('./pages/onboarding/onboarding.module').then(
        (m) => m.OnboardingModule
      ),
    data: {
      type: 'Workspace',
    },
  },
  {
    path: 'brand-guideline',
    loadChildren: () =>
      import('./pages/onboarding/onboarding.module').then(
        (m) => m.OnboardingModule
      ),
    data: {
      type: 'BrandGuidelines',
    },
  },
  {
    path: 'about-your-self',
    loadChildren: () =>
      import('./pages/onboarding/onboarding.module').then(
        (m) => m.OnboardingModule
      ),
    data: {
      type: 'AboutYourSelf',
    },
  },
  {
    path: 'export-get-started',
    loadChildren: () =>
      import('./pages/onboarding/onboarding.module').then(
        (m) => m.OnboardingModule
      ),
    data: {
      type: 'ExportGetStarted',
    },
  },
  {
    path: 'x-pilot',
    loadChildren: () =>
      import('./pages/navi/navi.module').then((m) => m.NaviModule),
  },
  {
    path: 'configuration/workflow/overview',
    loadChildren: () =>
      import('./pages/bpmn-diagram/bpmn-diagram.module').then(
        (m) => m.BpmnDiagramModule
      ),
  },
  {
    path: 'admin/user-invitation',
    loadChildren: () =>
      import('./pages/user-invitation/user-invitation.module').then(
        (m) => m.UserInvitationModule
      ),
  },
  {
    path: 'activity',
    loadChildren: () => import('./pages/logs/logs.module').then((m) => m.LogsModule)
  },
  {
    path: 'operate/change/history-log',
    loadChildren: () => import('./pages/logs/logs.module').then((m) => m.LogsModule)
  },
  {
    path: 'admin/user-approval',
    loadChildren: () =>
      import('./pages/user-approval/user-approval.module').then(
        (m) => m.UserApprovalModule
      )
  },
  {
    path: 'dynamic-form',
    component: SignupDynamicFormComponent,
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
