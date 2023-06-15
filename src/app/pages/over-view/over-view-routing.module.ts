import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverViewComponent } from './over-view.component';

const routes: Routes = [
  {
    path: '',
    component: OverViewComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverViewRoutingModule { }
