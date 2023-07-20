import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BpmnDiagramComponent } from './bpmn-diagram.component';
import { BpmnDiagramRoutingModule } from './bpmn-diagram-routing.module';

@NgModule({
  declarations: [
    BpmnDiagramComponent
  ],
  imports: [
    CommonModule,
    BpmnDiagramRoutingModule
  ]
})
export class BpmnDiagramModule { }
