import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './src/app/pages/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/sign-up/signup.module').then((m) => m.SignUpModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'use-cases',
    loadChildren: () => import('./pages/use-cases/use-cases.module').then(m => m.UseCasesModule)
  },
  {
    path: 'publish',
    loadChildren: () => import('./pages/publish/publish.module').then(m => m.PublishModule)
  },
  {
    path: 'configuration/api-integration',
    loadChildren: () => import('./pages/configure/configure.module').then(m => m.ConfigureModule)
  },
  {
    path: 'overview',
    loadChildren: () => import('./pages/over-view/over-view.module').then(m => m.OverViewModule)
  },
  {
    path: 'my-templates',
    loadChildren: () =>
      import('./pages/templates/templates.module').then(
        (m) => m.TemplatesModule
      ),
  },
  {
    path: 'design',
    loadChildren: () => import('./pages/template-builder/template-builder.module').then(m => m.TemplateBuilderModule)
  },
  {
    path: 'sample',
    loadChildren: () => import('./pages/sample/sample.module').then(m => m.SampleModule)
  },
  {
    path: 'operate',
    loadChildren: () => import('./pages/operate/operate.module').then(m => m.OperateModule)
  },
  {
    path: 'configuration/data-model',
    loadChildren: () => import('./pages/er-modeller/er-modeller.module').then(m => m.ErModellerModule)
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
    loadChildren: () => import('./pages/chat-bot/chat-bot.module').then(m => m.ChatBotModule),
  },

  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
