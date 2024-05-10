import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAgentComponent } from './create-agent.component';

const routes: Routes = [{ path: '', component: CreateAgentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateAgentRoutingModule { }
