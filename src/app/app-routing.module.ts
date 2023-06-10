import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneratorComponent } from './er-generator/generator.component';
import { UiFlowGraphComponent } from './ui-flow/ui-flow-graph/ui-flow-graph.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/sign-up/signup.module').then((m) => m.SignUpModule),
  },
  {
    path: 'my-templates',
    loadChildren: () =>
      import('./pages/templates/templates.module').then(
        (m) => m.TemplatesModule
      ),
  },
  {
    path: 'template-builder',
    loadChildren: () =>
      import('./pages/template-builder/template-builder.module').then(
        (m) => m.TemplateBuilderModule
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
    path: 'er-diagram',
    component: GeneratorComponent,
  },
  {
    path: 'ui-flow',
    component: UiFlowGraphComponent,
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
