import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserApprovalComponent } from './user-approval.component'
const routes: Routes = [
  {
    path: '',
    component: UserApprovalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserApprovalRoutingModule { }
