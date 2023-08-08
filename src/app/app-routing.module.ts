import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './src/app/pages/page-not-found/page-not-found.component';
import { BpmnDiagramComponent } from './pages/bpmn-diagram/bpmn-diagram.component';

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
    loadChildren: () => import('./pages/overview/overview.module').then(m => m.OverViewModule)
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
  // {
  //   path: 'configuration/data-model/overview',
  //   loadChildren: () => import('./pages/er-modeller/er-modeller.module').then(m => m.ErModellerModule)
  // },
  {
    path: 'products-config',
    loadChildren: () => import('./pages/products-config/products-config.module').then(m => m.ProductsConfigModule),
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
    loadChildren: () => import('./pages/navi/navi.module').then(m => m.NaviModule),
  },
  // {
  //   path: 'configuration/workflow/overview',
  //   loadChildren: () => import('./pages/bpmn-diagram/bpmn-diagram.module').then(m => m.BpmnDiagramModule),
  // },
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
