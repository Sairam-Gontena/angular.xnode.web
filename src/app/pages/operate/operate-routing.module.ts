import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperateComponent } from './operate.component';

const routes: Routes = [
  {
    path: '',
    component: OperateComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperateRoutingModule { }
