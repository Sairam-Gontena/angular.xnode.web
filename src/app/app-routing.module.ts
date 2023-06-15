import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneratorComponent } from './er-generator/generator.component';
import { PageNotFoundComponent } from './src/app/pages/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/sign-up/signup.module').then(m => m.SignUpModule)
  },
  {
    path: 'use-cases',
    loadChildren: () => import('./pages/use-cases/use-cases.module').then(m => m.UseCasesModule)
  },
  {
    path: 'configuration',
    loadChildren: () => import('./pages/configure/configure.module').then(m => m.ConfigureModule)
  },
  {
    path: 'over-view',
    loadChildren: () => import('./pages/over-view/over-view.module').then(m => m.OverViewModule)
  },
  {
    path: 'my-templates',
    loadChildren: () => import('./pages/templates/templates.module').then(m => m.TemplatesModule)
  },
  {
    path: 'design',
    loadChildren: () => import('./pages/template-builder/template-builder.module').then(m => m.TemplateBuilderModule)
  },
  {
    path: 'workspace',
    loadChildren: () => import('./pages/onboarding/onboarding.module').then(m => m.OnboardingModule),
    data: {
      type: 'Workspace'
    }
  },
  {
    path: 'brand-guideline',
    loadChildren: () => import('./pages/onboarding/onboarding.module').then(m => m.OnboardingModule),
    data: {
      type: 'BrandGuidelines'
    }
  },
  {
    path: 'about-your-self',
    loadChildren: () => import('./pages/onboarding/onboarding.module').then(m => m.OnboardingModule),
    data: {
      type: 'AboutYourSelf'
    }
  },
  {
    path: 'export-get-started',
    loadChildren: () => import('./pages/onboarding/onboarding.module').then(m => m.OnboardingModule),
    data: {
      type: 'ExportGetStarted'
    }
  },
  {
    path: 'chat-bot',
    loadChildren: () => import('./pages/chat-bot/chat-bot.module').then(m => m.ChatBotModule),
  },
  {
    path: 'er-diagram',
    component: GeneratorComponent,
  },

  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
