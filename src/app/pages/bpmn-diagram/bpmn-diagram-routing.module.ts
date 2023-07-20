import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BpmnDiagramComponent } from './bpmn-diagram.component';

const routes: Routes = [
  {
    path: '',
    component: BpmnDiagramComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BpmnDiagramRoutingModule { }
