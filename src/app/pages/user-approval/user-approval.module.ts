import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
import { UserApprovalRoutingModule } from './user-approval-routing.module';
import { UserApprovalComponent } from './user-approval.component'

@NgModule({
  declarations: [UserApprovalComponent],
  imports: [
    CommonModule,
    UserApprovalRoutingModule,
    SharedModule,
    SharedComponentModule
  ]
})
export class UserApprovalModule { }
