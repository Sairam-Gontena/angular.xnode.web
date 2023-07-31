import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BpmnDiagramComponent } from './bpmn-diagram.component';
import { BpmnDiagramRoutingModule } from './bpmn-diagram-routing.module';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    BpmnDiagramRoutingModule,
    // SidebarModule,
    // ButtonModule,
  ],
  exports: [

  ]
})
export class BpmnDiagramModule { }
