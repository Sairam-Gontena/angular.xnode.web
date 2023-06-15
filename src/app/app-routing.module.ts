import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneratorComponent } from './er-generator/generator.component';

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
    path: 'my-templates',
    loadChildren: () => import('./pages/templates/templates.module').then(m => m.TemplatesModule)
  },
  {
    path: 'template-builder',
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

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
