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
import { ListViewComponent } from './list-view/list-view.component';
import { ParaViewComponent } from './para-view/para-view.component';
import { CommentsCrPanelComponent } from './comments-cr-panel/comments-cr-panel.component';
import { CommentsTabsComponent } from './comments-tabs/comments-tabs.component';
import { CrTabsComponent } from 'src/app/cr-tabs/cr-tabs.component';
import { NoCommentsComponent } from 'src/app/no-comments/no-comments.component';
import { SpecSectionsLayoutComponent } from './spec-sections-layout/spec-sections-layout.component';
import { CommentsPanelComponent } from './comments-panel/comments-panel.component';
import { ConfirmationalertComponent } from './confirmationalert/confirmationalert.component';
import { SpecConversationComponent } from 'src/app/pages/specifications/spec-conversation/spec-conversation.component';
import { LinkToCrComponent } from 'src/app/link-to-cr/link-to-cr.component';
import { ConversationActionsComponent } from './conversation-actions/conversation-actions.component';
import { CreateNewCrVersionComponent } from './create-new-cr-version/create-new-cr-version.component';
import { SpecChildConversationComponent } from './spec-child-conversation/spec-child-conversation.component';
import { TasksPanelComponent } from './tasks-panel/tasks-panel.component';
import { TaskListComponent } from './task-list/task-list.component';
@NgModule({
  declarations: [
    SpecificationsComponent,
    SpecificationsMenuComponent,
    SpecificationsHeaderComponent,
    SpecificationsContentComponent,
    CommentsPanelComponent,
    CommentsCrPanelComponent,
    UserPersonaComponent,
    SpecGenPopupComponent,
    UserRolesComponent,
    ListViewComponent,
    ParaViewComponent,
    CommentsTabsComponent,
    CrTabsComponent,
    NoCommentsComponent,
    SpecSectionsLayoutComponent,
    CamelToTitlePipe,
    ObjectToArrayPipe,
    ConfirmationalertComponent,
    SpecConversationComponent,
    LinkToCrComponent,
    ConversationActionsComponent,
    CreateNewCrVersionComponent,
    SpecChildConversationComponent,
    TasksPanelComponent,
    TaskListComponent
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
