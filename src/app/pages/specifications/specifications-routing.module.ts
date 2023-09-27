import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecificationsComponent } from './specifications.component';

const routes: Routes = [
  {
    path: '',
    component: SpecificationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecificationsRoutingModule { }
