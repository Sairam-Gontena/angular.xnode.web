import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsConfigRoutingModule } from './products-config-routing.module';
import { ProductsConfigComponent } from './products-config.component';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
import { BpmnDiagramComponent } from '../bpmn-diagram/bpmn-diagram.component';
import { DataService } from '../er-modeller/service/data.service';
import { JsPlumbService } from '../er-modeller/service/jsPlumb.service';
import { UtilService } from '../er-modeller/service/util.service';

@NgModule({
  declarations: [
    ProductsConfigComponent,
    // BpmnDiagramComponent,
  ],
  imports: [
    CommonModule,
    ProductsConfigRoutingModule,
    SharedComponentModule
  ],
  providers: [DataService, JsPlumbService, UtilService],
})
export class ProductsConfigModule { }
