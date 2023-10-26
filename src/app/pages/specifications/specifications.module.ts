import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SpecificationsRoutingModule } from './specifications-routing.module';
import { SpecificationsComponent } from './specifications.component';
import { SpecificationsMenuComponent } from './specifications-menu/specifications-menu.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SpecificationsHeaderComponent } from './specifications-header/specifications-header.component';
import { SpecificationsContentComponent } from 'src/app/pages/specifications/specifications-content/specifications-content.component';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
import { CamelToTitlePipe } from 'src/app/pipes/camelToTitleCase.pipe';
import { ObjectToArrayPipe } from 'src/app/pipes/objectToArray.pipe';
import { UserPersonaComponent } from './user-persona/user-persona.component';
import { SpecGenPopupComponent } from './spec-gen-popup/spec-gen-popup.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { HighlightPipe } from 'src/app/pipes/highlight.pipe';
@NgModule({
  declarations: [
    SpecificationsComponent,
    SpecificationsMenuComponent,
    SpecificationsHeaderComponent,
    SpecificationsContentComponent,
    UserPersonaComponent,
    SpecGenPopupComponent,
    UserRolesComponent,
    CamelToTitlePipe,
    ObjectToArrayPipe
  ],
  imports: [
    CommonModule,
    InputSwitchModule,
    SpecificationsRoutingModule,
    SharedModule,
    SharedComponentModule
  ],
  providers: [HighlightPipe]
})
export class SpecificationsModule { }
