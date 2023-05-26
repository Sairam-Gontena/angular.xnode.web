import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneratorComponent } from './er-generator/generator.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/sign-up/signup.module').then(m => m.SignUpModule)
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./pages/onboarding/onboarding.module').then(m => m.OnboardingModule)
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
