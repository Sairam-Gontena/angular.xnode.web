import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BpmnDiagramComponent } from './bpmn-diagram.component';
import { BpmnDiagramRoutingModule } from './bpmn-diagram-routing.module';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
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
    // SidebarModule,
    // ButtonModule,
  ],
  exports: [

  ]
})
export class BpmnDiagramModule { }
