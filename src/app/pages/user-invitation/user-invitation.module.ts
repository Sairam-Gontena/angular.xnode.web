import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
import { UserInvitationRoutingModule } from './user-invitation-routing.module';
import { UserInvitationComponent } from './user-invitation.component'

@NgModule({
  declarations: [UserInvitationComponent],
  imports: [
    CommonModule,
    UserInvitationRoutingModule,
    SharedModule,
    SharedComponentModule
  ]
})
export class UserInvitationModule { }
