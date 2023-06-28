import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GeneratorComponent } from './generator.component';
import { ModelComponent } from './model/model.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DataService } from './service/data.service';
import { JsPlumbService } from './service/jsPlumb.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalUploadComponent } from './modal-upload/modal-upload.component';
import { ModalDownloadComponent } from './modal-download/modal-download.component';
import { ModalRelationComponent } from './modal-relation/modal-relation.component';
import { ModalDataComponent } from './modal-data/modal-data.component';
import { ModalModelComponent } from './modal-model/modal-model.component';
import { ModalSchemaComponent } from './modal-schema/modal-schema.component';
import { SchemaComponent } from './schema/schema.component';
import { TemplateBuilderModule } from '../pages/template-builder/template-builder.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
// PRIMENG
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
// PRIMENG
import { CreateSchemaComponent } from './create-schema/create-schema.component';
import { ErModellerComponent } from './er-modeller/er-modeller.component';
import { UtilService } from './service/util.service';
import { PrimeModulesModule } from '../prime-modules/prime-modules.module';
import { ConfigureModule } from '../pages/configure/configure.module';
import { ErGeneratorLayoutComponent } from './er-generator-layout/er-generator-layout.component';

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
    CreateSchemaComponent,
    ErModellerComponent,
    ErGeneratorLayoutComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TemplateBuilderModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    NgSelectModule,
    // PRIMENG
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    DialogModule,
    CheckboxModule,
    DropdownModule,
    PrimeModulesModule,
    // ConfigureModule
  ],
  providers: [DataService, JsPlumbService, UtilService],
  exports: [GeneratorComponent, ErModellerComponent],
  bootstrap: [GeneratorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ERGeneratorModule { }
