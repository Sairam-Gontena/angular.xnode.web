import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiffViewerRoutingModule } from './diff-viewer-routing.module';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { DiffCompComponent } from 'src/app/components/diff-comp/diff-comp.component';
import { DiffListComponent } from 'src/app/components/diff-list/diff-list.component';
import { DiffGeneratorComponent } from 'src/app/components/diff-generator/diff-generator.component';
import { DiffViewerComponent } from './diff-viewer.component';
// import { UserPersonaComponent } from '../specifications/user-persona/user-persona.component';
import { TextEditorComponent } from 'src/app/components/text-editor/text-editor.component';

@NgModule({
  declarations: [
    DiffViewerComponent,
    DiffCompComponent,
    DiffListComponent,
    DiffGeneratorComponent,
    TextEditorComponent
    // UserPersonaComponent
  ],
  imports: [
    CommonModule,
    DiffViewerRoutingModule,
    SharedModule,
    SharedComponentModule
  ]
})
export class DiffViewerModule { }
