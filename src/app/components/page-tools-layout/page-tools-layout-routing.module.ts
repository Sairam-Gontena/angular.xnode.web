import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageToolsLayoutComponent } from './page-tools-layout.component';

const routes: Routes = [
  {
    path: '',
    component: PageToolsLayoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PageToolsLayoutRoutingModule { }
