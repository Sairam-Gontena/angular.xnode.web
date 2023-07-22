import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErModellerRoutingModule } from './er-modeller-routing.module';
import { ErModellerComponent } from './er-modeller.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ModelComponent } from './model/model.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ModalRelationComponent } from './modal-relation/modal-relation.component';
import { SchemaComponent } from './schema/schema.component';
import { ModalSchemaComponent } from './modal-schema/modal-schema.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalDataComponent } from './modal-data/modal-data.component';
import { ModalModelComponent } from './modal-model/modal-model.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { DataService } from './service/data.service';
import { JsPlumbService } from './service/jsPlumb.service';
import { UtilService } from './service/util.service';

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
    DropdownModule,
    ButtonModule,
    ProgressSpinnerModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    InputTextModule,
    ToastModule,
    ModalModule.forRoot()
  ],
  providers: [DataService, JsPlumbService, UtilService],
})
export class ErModellerModule { }
