import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/sign-up/signup.module').then(m => m.SignUpModule)

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
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'dynamic-table',
    component: DynamicTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
