import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './src/app/pages/page-not-found/page-not-found.component';
import { SignupDynamicFormComponent } from './components/form-builder/signup-dynamic-form/signup-dynamic-form.component';
import { AuthGuard } from './auth.gaurd';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./pages/forgot-password/forgotpassword.module').then((m) => m.ForgotPasswordModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./pages/reset-password/resetpassword.module').then((m) => m.ResetPasswordModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'verify-otp',
    loadChildren: () => import('./pages/verify-otp/verify-otp.module').then((m) => m.VerifyOtpModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'usecases',
    loadChildren: () =>
      import('./pages/use-cases/use-cases.module').then(
        (m) => m.UseCasesModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'publish',
    loadChildren: () =>
      import('./pages/publish/publish.module').then((m) => m.PublishModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'configuration/api-integration',
    loadChildren: () =>
      import('./pages/configure/configure.module').then(
        (m) => m.ConfigureModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'overview',
    loadChildren: () =>
      import('./pages/overview/overview.module').then((m) => m.OverViewModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'my-products',
    loadChildren: () =>
      import('./pages/my-products/my-products.module').then(
        (m) => m.MyProductsModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'acitvity',
    loadChildren: () =>
      import('./pages/activity-logs/activity-logs.module').then(
        (m) => m.ActivityLogsModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/template-builder/template-builder.module').then(
        (m) => m.TemplateBuilderModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'sample',
    loadChildren: () =>
      import('./pages/sample/sample.module').then((m) => m.SampleModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'operate',
    loadChildren: () =>
      import('./pages/operate/operate.module').then((m) => m.OperateModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'configuration/data-model/overview',
    loadChildren: () =>
      import('./pages/er-modeller/er-modeller.module').then(
        (m) => m.ErModellerModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'workspace',
    loadChildren: () =>
      import('./pages/onboarding/onboarding.module').then(
        (m) => m.OnboardingModule
      ),
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard]
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
    canActivate: [AuthGuard]
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
    canActivate: [AuthGuard]
  },
  {
    path: 'x-pilot',
    loadChildren: () =>
      import('./pages/navi/navi.module').then((m) => m.NaviModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'configuration/workflow/overview',
    loadChildren: () =>
      import('./pages/bpmn-diagram/bpmn-diagram.module').then(
        (m) => m.BpmnDiagramModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/user-invitation',
    loadChildren: () =>
      import('./pages/user-invitation/user-invitation.module').then(
        (m) => m.UserInvitationModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'activity',
    loadChildren: () => import('./pages/logs/logs.module').then((m) => m.LogsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'operate/change/history-log',
    loadChildren: () => import('./pages/logs/logs.module').then((m) => m.LogsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/user-approval',
    loadChildren: () =>
      import('./pages/user-approval/user-approval.module').then(
        (m) => m.UserApprovalModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'dynamic-form',
    component: SignupDynamicFormComponent,
    canActivate: [AuthGuard]
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
