import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { SignupDynamicFormComponent } from './components/form-builder/signup-dynamic-form/signup-dynamic-form.component';
import { authGuard } from './auth.guard';

const routes: Routes = [{
  path: '',
  loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule)
}, {
  path: 'login',
  loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule)
}, {
  path: 'forgot-password/:email', canActivate: [authGuard],
  loadChildren: () => import('./pages/forgot-password/forgotpassword.module').then((m) => m.ForgotPasswordModule)
}, {
  path: 'reset-password',
  loadChildren: () => import('./pages/reset-password/resetpassword.module').then((m) => m.ResetPasswordModule)
}, {
  path: 'verify-otp/:email', canActivate: [authGuard],
  loadChildren: () => import('./pages/verify-otp/verify-otp.module').then((m) => m.VerifyOtpModule)
}, {
  path: 'usecases', canActivate: [authGuard],
  loadChildren: () => import('./pages/use-cases/use-cases.module').then((m) => m.UseCasesModule)
}, {
  path: 'publish', canActivate: [authGuard],
  loadChildren: () => import('./pages/publish/publish.module').then((m) => m.PublishModule)
}, {
  path: 'configuration/api-integration', canActivate: [authGuard],
  loadChildren: () => import('./pages/configure/configure.module').then((m) => m.ConfigureModule)
}, {
  path: 'overview', canActivate: [authGuard],
  loadChildren: () => import('./pages/overview/overview.module').then((m) => m.OverViewModule)
}, {
  path: 'my-products', canActivate: [authGuard],
  loadChildren: () => import('./pages/my-products/my-products.module').then((m) => m.MyProductsModule)
}, {
  path: 'acitvity', canActivate: [authGuard],
  loadChildren: () => import('./pages/activity-logs/activity-logs.module').then((m) => m.ActivityLogsModule)
}, {
  path: 'dashboard', canActivate: [authGuard],
  loadChildren: () => import('./pages/template-builder/template-builder.module').then((m) => m.TemplateBuilderModule)
}, {
  path: 'sample',
  loadChildren: () => import('./pages/sample/sample.module').then((m) => m.SampleModule)
}, {
  path: 'operate', canActivate: [authGuard],
  loadChildren: () => import('./pages/operate/operate.module').then((m) => m.OperateModule)
}, {
  path: 'configuration/data-model/overview', canActivate: [authGuard],
  loadChildren: () => import('./pages/er-modeller/er-modeller.module').then((m) => m.ErModellerModule)
}, {
  path: 'workspace', canActivate: [authGuard],
  loadChildren: () => import('./pages/onboarding/onboarding.module').then((m) => m.OnboardingModule),
  data: { type: 'Workspace' }
}, {
  path: 'brand-guideline', canActivate: [authGuard],
  loadChildren: () => import('./pages/onboarding/onboarding.module').then((m) => m.OnboardingModule),
  data: { type: 'BrandGuidelines' }
}, {
  path: 'about-your-self', canActivate: [authGuard],
  loadChildren: () => import('./pages/onboarding/onboarding.module').then((m) => m.OnboardingModule),
  data: { type: 'AboutYourSelf' }
}, {
  path: 'export-get-started', canActivate: [authGuard],
  loadChildren: () => import('./pages/onboarding/onboarding.module').then((m) => m.OnboardingModule),
  data: { type: 'ExportGetStarted' }
}, {
  path: 'configuration/workflow/overview', canActivate: [authGuard],
  loadChildren: () => import('./pages/bpmn-diagram/bpmn-diagram.module').then((m) => m.BpmnDiagramModule)
}, {
  path: 'admin/user-invitation', canActivate: [authGuard],
  loadChildren: () => import('./pages/user-invitation/user-invitation.module').then((m) => m.UserInvitationModule)
}, {
  path: 'activity', canActivate: [authGuard],
  loadChildren: () => import('./pages/logs/logs.module').then((m) => m.LogsModule)
}, {
  path: 'operate/change/history-log', canActivate: [authGuard],
  loadChildren: () => import('./pages/logs/logs.module').then((m) => m.LogsModule)
}, {
  path: 'history-log', canActivate: [authGuard],
  loadChildren: () => import('./pages/logs/logs.module').then((m) => m.LogsModule)
}, {
  path: 'admin/user-approval', canActivate: [authGuard],
  loadChildren: () => import('./pages/user-approval/user-approval.module').then((m) => m.UserApprovalModule)
}, {
  path: 'dynamic-form', component: SignupDynamicFormComponent, canActivate: [authGuard]
}, {
  path: 'specification', canActivate: [authGuard],
  loadChildren: () => import('./pages/diff-viewer/diff-viewer.module').then((m) => m.DiffViewerModule)
}, {
  path: 'help-center', canActivate: [authGuard],
  loadChildren: () => import('./pages/help-center/help-center.module').then((m) => m.HelpCentreModule)
}, {
  path: 'feedback-list',
  loadChildren: () => import('./pages/feedback-list/feedback-list.module').then((m) => m.FeedbackListModule)
}, {
  path: 'specification1',
  loadChildren: () => import('./pages/specifications/specifications.module').then((m) => m.SpecificationsModule)
}, {
  path: 'agent-playground', data: { breadcrumb: 'Agent Hub' },
  loadChildren: () => import('./pages/agent-hub/agent-hub.module').then((m) => m.AgentHubModule)
}, {
  path: 'create-agent',
  loadChildren: () => import('./pages/create-agent/create-agent.module').then((m) => m.CreateAgentModule)
}, { path: '', redirectTo: '', pathMatch: 'full' },
{ path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
