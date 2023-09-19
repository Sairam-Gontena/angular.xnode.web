import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackListComponent } from './feedback-list.component';

const routes: Routes = [
  {
    path: '',
    component: FeedbackListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackListRoutingModule { }
