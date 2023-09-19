import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './src/app/pages/page-not-found/page-not-found.component';
import { SignupDynamicFormComponent } from './components/form-builder/signup-dynamic-form/signup-dynamic-form.component';
import { authGuard } from './auth.guard';

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
    path: 'forgot-password/:email',
    loadChildren: () =>
      import('./pages/forgot-password/forgotpassword.module').then((m) => m.ForgotPasswordModule),
    canActivate: [authGuard]
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./pages/reset-password/resetpassword.module').then((m) => m.ResetPasswordModule)
  },
  {
    path: 'verify-otp/:email',
    loadChildren: () => import('./pages/verify-otp/verify-otp.module').then((m) => m.VerifyOtpModule),
    canActivate: [authGuard]

  },
  {
    path: 'usecases',
    loadChildren: () =>
      import('./pages/use-cases/use-cases.module').then(
        (m) => m.UseCasesModule
      ),
    canActivate: [authGuard]

  },
  {
    path: 'publish',
    loadChildren: () =>
      import('./pages/publish/publish.module').then((m) => m.PublishModule),
    canActivate: [authGuard]

  },
  {
    path: 'configuration/api-integration',
    loadChildren: () =>
      import('./pages/configure/configure.module').then(
        (m) => m.ConfigureModule
      ),
    canActivate: [authGuard]

  },
  {
    path: 'overview',
    loadChildren: () =>
      import('./pages/overview/overview.module').then((m) => m.OverViewModule),
    canActivate: [authGuard]

  },
  {
    path: 'my-products',
    loadChildren: () =>
      import('./pages/my-products/my-products.module').then(
        (m) => m.MyProductsModule
      ),
    canActivate: [authGuard]

  },
  {
    path: 'acitvity',
    loadChildren: () =>
      import('./pages/activity-logs/activity-logs.module').then(
        (m) => m.ActivityLogsModule
      ),
    canActivate: [authGuard]

  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/template-builder/template-builder.module').then(
        (m) => m.TemplateBuilderModule
      ),
    canActivate: [authGuard]

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
    canActivate: [authGuard]

  },
  {
    path: 'configuration/data-model/overview',
    loadChildren: () =>
      import('./pages/er-modeller/er-modeller.module').then(
        (m) => m.ErModellerModule
      ),
    canActivate: [authGuard]

  },
  {
    path: 'workspace',
    loadChildren: () =>
      import('./pages/onboarding/onboarding.module').then(
        (m) => m.OnboardingModule
      ),
    canActivate: [authGuard],
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
    canActivate: [authGuard],

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
    canActivate: [authGuard],
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
    canActivate: [authGuard]

  },
  {
    path: 'x-pilot',
    loadChildren: () =>
      import('./pages/navi/navi.module').then((m) => m.NaviModule),
    canActivate: [authGuard]

  },
  {
    path: 'configuration/workflow/overview',
    loadChildren: () =>
      import('./pages/bpmn-diagram/bpmn-diagram.module').then(
        (m) => m.BpmnDiagramModule
      ),
    canActivate: [authGuard]

  },
  {
    path: 'admin/user-invitation',
    loadChildren: () =>
      import('./pages/user-invitation/user-invitation.module').then(
        (m) => m.UserInvitationModule
      ),
    canActivate: [authGuard]

  },
  {
    path: 'activity',
    loadChildren: () => import('./pages/logs/logs.module').then((m) => m.LogsModule),
    canActivate: [authGuard]

  },
  {
    path: 'operate/change/history-log',
    loadChildren: () => import('./pages/logs/logs.module').then((m) => m.LogsModule),
    canActivate: [authGuard]

  },
  {
    path: 'admin/user-approval',
    loadChildren: () =>
      import('./pages/user-approval/user-approval.module').then(
        (m) => m.UserApprovalModule
      ),
    canActivate: [authGuard]

  },
  {
    path: 'dynamic-form',
    component: SignupDynamicFormComponent,
    canActivate: [authGuard]

  },
  {
    path: 'help-center',
    loadChildren: () => import('./pages/help-center/help-center.module').then((m) => m.HelpCentreModule),
    canActivate: [authGuard]

  },
  {
    path: 'feedback-list',
    loadChildren: () => import('./pages/feedback-list/feedback-list.module').then((m) => m.FeedbackListModule)
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
