import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErModellerRoutingModule } from './er-modeller-routing.module';
import { ErModellerComponent } from './er-modeller.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModelComponent } from './model/model.component';
import { ModalRelationComponent } from './modal-relation/modal-relation.component';
import { SchemaComponent } from './schema/schema.component';
import { ModalSchemaComponent } from './modal-schema/modal-schema.component';
import { ModalDataComponent } from './modal-data/modal-data.component';
import { ModalModelComponent } from './modal-model/modal-model.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataService } from './service/data.service';
import { JsPlumbService } from './service/jsPlumb.service';
import { UtilService } from './service/util.service';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';

@NgModule({
  declarations: [
    ErModellerComponent,
    ModelComponent,
    ModalRelationComponent,
    SchemaComponent,
    ModalSchemaComponent,
    ModalDataComponent,
    ModalModelComponent
  ],
  imports: [
    CommonModule,
    ErModellerRoutingModule,
    SharedModule,
    SharedComponentModule,
    ModalModule.forRoot()
  ],
  providers: [DataService, JsPlumbService, UtilService],
})
export class ErModellerModule { }
