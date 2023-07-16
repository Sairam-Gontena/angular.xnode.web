import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErModellerComponent } from './er-modeller.component';

const routes: Routes = [
  {
    path: '',
    component: ErModellerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErModellerRoutingModule { }
