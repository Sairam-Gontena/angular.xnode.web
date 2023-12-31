import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiffViewerComponent } from './diff-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: DiffViewerComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiffViewerRoutingModule { }
