import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateBuilderComponent } from './template-builder.component';

const routes: Routes = [
  {
    path: '',
    component: TemplateBuilderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TemplateBuilderRoutingModule { }
