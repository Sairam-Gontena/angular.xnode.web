import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserInvitationComponent } from './user-invitation.component'
const routes: Routes = [
  {
    path: '',
    component: UserInvitationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserInvitationRoutingModule { }
