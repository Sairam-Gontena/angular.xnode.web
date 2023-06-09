import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneratorComponent } from './er-generator/generator.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/sign-up/signup.module').then(m => m.SignUpModule)
  },
  {
    path: 'my-templates',
    loadChildren: () => import('./pages/templates/templates.module').then(m => m.TemplatesModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'template-builder',
    loadChildren: () => import('./pages/template-builder/template-builder.module').then(m => m.TemplateBuilderModule)
  },
  {
    path: 'chats',
    loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatModule)
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
