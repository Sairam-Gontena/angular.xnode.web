import { NgModule } from "@angular/core";
import { GeneratorComponent } from "./generator.component";
import { ModelComponent } from "./model/model.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { DataService } from "./service/data.service";
import { JsPlumbService } from "./service/jsPlumb.service";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { ModalUploadComponent } from "./modal-upload/modal-upload.component";
import { ModalDownloadComponent } from "./modal-download/modal-download.component";
import { ModalRelationComponent } from "./modal-relation/modal-relation.component";
import { ModalDataComponent } from "./modal-data/modal-data.component";
import { ModalModelComponent } from "./modal-model/modal-model.component";
import { ModalSchemaComponent } from "./modal-schema/modal-schema.component";
import { SchemaComponent } from "./schema/schema.component";



import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    GeneratorComponent,
    NavbarComponent,
    ModelComponent,
    SchemaComponent,
    ModalDataComponent,
    ModalModelComponent,
    ModalSchemaComponent,
    ModalRelationComponent,
    ModalDownloadComponent,
    ModalUploadComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    NgSelectModule,
  ],
  providers: [
    DataService,
    JsPlumbService
  ],
  bootstrap: [GeneratorComponent]
})
export class ERGeneratorModule { }
