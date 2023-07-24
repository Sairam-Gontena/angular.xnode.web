import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NaviComponent } from './navi.component';

const routes: Routes = [
  {
    path: '',
    component: NaviComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NaviRoutingModule { }
