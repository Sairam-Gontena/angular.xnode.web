import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeFinbuddyComponent } from './welcome-finbuddy.component';

const routes: Routes = [
  {
    path:'',
    component: WelcomeFinbuddyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeFinbuddyRoutingModule { }
