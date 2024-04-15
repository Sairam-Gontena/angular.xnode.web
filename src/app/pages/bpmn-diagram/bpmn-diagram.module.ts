import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BpmnDiagramRoutingModule } from './bpmn-diagram-routing.module';
import { SharedModule } from 'primeng/api';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    BpmnDiagramRoutingModule,
    SharedModule,
    SharedComponentModule,
  ],
  exports: [

  ]
})
export class BpmnDiagramModule { }
