import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperateComponent } from './operate.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AlertComponent } from './alert/alert.component';

const routes: Routes = [
  {
    path: '',
    component: OperateComponent
  },
  {
    path: 'feedback',
    component: FeedbackComponent
  },
  {
    path: 'alert',
    component: AlertComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperateRoutingModule { }
