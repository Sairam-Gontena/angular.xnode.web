import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditionalInfoComponent } from '../components/additional-info/additional-info.component';
import { AppHeaderComponent } from '../components/app-header/app-header.component';
import { AppSideMenuComponent } from '../components/app-side-menu/app-side-menu.component';
import { BotComponent } from '../components/bot/bot.component';
import { ConfigureLayoutComponent } from '../components/configure-layout/configure-layout.component';
import { LayoutElementsComponent } from '../components/layout-elements/layout-elements.component';
import { OperateFeedbackComponent } from '../components/operate-feedback/operate-feedback.component';
import { OperateLayoutComponent } from '../components/operate-layout/operate-layout.component';
import { PageToolsLayoutComponent } from '../components/page-tools-layout/page-tools-layout.component';
import { StepComponent } from '../components/step/step.component';
import { TemplateBuilderPublishHeaderComponent } from '../components/template-builder-publish-header/template-builder-publish-header.component';
import { SharedModule } from './shared.module';
import { DynamicTableComponent } from '../components/dynamic-table/dynamic-table.component';
import { NotificationPanelComponent } from '../components/notification-panel/notification-panel.component';
import { ConfirmationPopupComponent } from '../components/confirmation-popup/confirmation-popup.component';
import { ReportBugComponent } from '../components/report-bug/report-bug.component';
import { CustomerFeedbackComponent } from '../components/customer-feedback/customer-feedback.component';
import { ThankYouComponent } from '../components/thank-you/thank-you.component';
import { GeneralFeedbackComponent } from '../components/general-feedback/general-feedback.component';
import { ActionButtonComponent } from '../components/action-button/action-button.component';
import { ViewExistingFeedbackComponent } from '../components/view-existing-feedback/view-existing-feedback.component';
import { ViewSummaryPopupComponent } from '../components/view-summary-popup/view-summary-popup.component';

import { ProductAlertPopupComponent } from '../components/product-alert-popup/product-alert-popup.component';
import { LimitReachedPopupComponent } from '../components/limit-reached-popup/limit-reached-popup.component';
import { BpmnCommonComponent } from '../components/bpmn-common/bpmn-common.component';
import { DataModelCommonComponent } from '../components/data-model-common/data-model-common.component';
import { ModalModelComponent } from '../pages/er-modeller/modal-model/modal-model.component';
import { ModalDataComponent } from '../pages/er-modeller/modal-data/modal-data.component';
import { ModalSchemaComponent } from '../pages/er-modeller/modal-schema/modal-schema.component';
import { ModelComponent } from '../pages/er-modeller/model/model.component';
import { ModalRelationComponent } from '../pages/er-modeller/modal-relation/modal-relation.component';
import { SchemaComponent } from '../pages/er-modeller/schema/schema.component';
import { BpmnDiagramComponent } from '../pages/bpmn-diagram/bpmn-diagram.component';
import { ExpandSpecificationComponent } from '../components/expand-specification/expand-specification.component';
import { CommonUsecasesComponent } from '../components/common-usecases/common-usecases.component';
import { ChangeRequestsPanelComponent } from '../components/change-requests-panel/change-requests-panel.component';
import { DataDictionaryComponent } from '../pages/specifications/data-dictionary/data-dictionary.component';
import { CommonSpecTableComponent } from '../common-spec-table/common-spec-table.component';
import { SharedPipesModule } from '../pipes/sharedPipes.module';
import { ProductDropdownComponent } from '../components/product-dropdown/product-dropdown.component';
import { AddCommentOverlayPanelComponent } from '../pages/specifications/add-comment-overlay-panel/add-comment-overlay-panel.component';
import { ConfirmationPopupNewComponent } from '../confirmation-popup-new/confirmation-popup-new.component';
import { AddCrVersionComponent } from '../components/add-cr-version/add-cr-version.component';
import { UserPersonaComponent } from '../pages/specifications/user-persona/user-persona.component';
import { SpecificationsHeaderComponent } from '../pages/specifications/specifications-header/specifications-header.component';
import { SpecificationsMenuComponent } from '../pages/specifications/specifications-menu/specifications-menu.component';
import { SpecGenPopupComponent } from '../pages/specifications/spec-gen-popup/spec-gen-popup.component';
import { AddTaskComponent } from '../pages/specifications/add-task/add-task.component';
import { CommentsCrPanelComponent } from '../pages/specifications/comments-cr-panel/comments-cr-panel.component';
import { CommentsTabsComponent } from '../pages/specifications/comments-tabs/comments-tabs.component';
import { CrTabsComponent } from '../cr-tabs/cr-tabs.component';
import { TaskListComponent } from '../pages/specifications/task-list/task-list.component';
import { TaskChildConversationComponent } from '../pages/specifications/task-child-conversation/task-child-conversation.component';
import { TasksPanelComponent } from '../pages/specifications/tasks-panel/tasks-panel.component';
import { CommentsPanelComponent } from '../pages/specifications/comments-panel/comments-panel.component';
import { NoCommentsComponent } from '../no-comments/no-comments.component';
import { LinkToCrComponent } from '../link-to-cr/link-to-cr.component';
import { ParaViewComponent } from '../pages/specifications/para-view/para-view.component';
import { UserRolesComponent } from '../pages/specifications/user-roles/user-roles.component';
import { ListViewComponent } from '../pages/specifications/list-view/list-view.component';
import { CreateNewCrVersionComponent } from '../pages/specifications/create-new-cr-version/create-new-cr-version.component';
import { SpecConversationComponent } from '../pages/specifications/spec-conversation/spec-conversation.component';
import { ConversationActionsComponent } from '../pages/specifications/conversation-actions/conversation-actions.component';
import { SpecChildConversationComponent } from '../pages/specifications/spec-child-conversation/spec-child-conversation.component';
import { ImportFilePopupComponent } from '../components/import-file-popup/import-file-popup.component';
// import { DiffCompComponent } from '../components/diff-comp/diff-comp.component';
// import { DiffGeneratorComponent } from '../components/diff-generator/diff-generator.component';
// import { DiffListComponent } from '../components/diff-list/diff-list.component';

import { MultiSelectCheckboxComponent } from '../components/multi-select-checkbox/multi-select-checkbox.component';
import { BreadcrumbsComponent } from '../components/breadcrumbs/breadcrumbs.component';
import { AgentOverviewComponent } from '../components/agent-hub/create-agent/agent-overview/agent-overview.component';
import { AgentInstructionComponent } from '../components/agent-hub/create-agent/agent-instruction/agent-instruction.component';
@NgModule({
  declarations: [
    AdditionalInfoComponent,
    AppHeaderComponent,
    AppSideMenuComponent,
    BotComponent,
    ConfigureLayoutComponent,
    LayoutElementsComponent,
    OperateFeedbackComponent,
    OperateLayoutComponent,
    PageToolsLayoutComponent,
    StepComponent,
    DynamicTableComponent,
    TemplateBuilderPublishHeaderComponent,
    NotificationPanelComponent,
    ConfirmationPopupComponent,
    ReportBugComponent,
    CustomerFeedbackComponent,
    ThankYouComponent,
    GeneralFeedbackComponent,
    ActionButtonComponent,
    ProductAlertPopupComponent,
    ViewExistingFeedbackComponent,
    ViewSummaryPopupComponent,
    LimitReachedPopupComponent,
    BpmnCommonComponent,
    DataModelCommonComponent,
    ModalModelComponent,
    ModalDataComponent,
    ModalSchemaComponent,
    ModelComponent,
    ModalRelationComponent,
    SchemaComponent,
    BpmnDiagramComponent,
    ExpandSpecificationComponent,
    CommonUsecasesComponent,
    ChangeRequestsPanelComponent,
    DataDictionaryComponent,
    CommonSpecTableComponent,
    ProductDropdownComponent,
    AddCommentOverlayPanelComponent,
    ConfirmationPopupNewComponent,
    AddCrVersionComponent,
    // DiffCompComponent,
    // DiffGeneratorComponent,
    // DiffListComponent,
    UserPersonaComponent,
    SpecificationsHeaderComponent,
    SpecificationsMenuComponent,
    SpecGenPopupComponent,
    AddTaskComponent,
    CommentsCrPanelComponent,
    CommentsTabsComponent,
    CrTabsComponent,
    TaskListComponent,
    TaskChildConversationComponent,
    TasksPanelComponent,
    CommentsPanelComponent,
    NoCommentsComponent,
    LinkToCrComponent,
    ParaViewComponent,
    UserRolesComponent,
    ListViewComponent,
    CreateNewCrVersionComponent,
    SpecConversationComponent,
    ConversationActionsComponent,
    SpecChildConversationComponent,
    MultiSelectCheckboxComponent,
    BreadcrumbsComponent,
    ImportFilePopupComponent,
    AgentOverviewComponent,
    AgentInstructionComponent,
    ImportFilePopupComponent
  ],
  imports: [CommonModule, SharedModule, SharedPipesModule],
  exports: [
    AdditionalInfoComponent,
    AppHeaderComponent,
    AppSideMenuComponent,
    BotComponent,
    ConfigureLayoutComponent,
    LayoutElementsComponent,
    OperateFeedbackComponent,
    OperateLayoutComponent,
    PageToolsLayoutComponent,
    StepComponent,
    DynamicTableComponent,
    TemplateBuilderPublishHeaderComponent,
    NotificationPanelComponent,
    ConfirmationPopupComponent,
    ReportBugComponent,
    CustomerFeedbackComponent,
    ThankYouComponent,
    GeneralFeedbackComponent,
    ActionButtonComponent,
    ProductAlertPopupComponent,
    ViewExistingFeedbackComponent,
    ViewSummaryPopupComponent,
    LimitReachedPopupComponent,
    BpmnCommonComponent,
    DataModelCommonComponent,
    ModalModelComponent,
    ModalDataComponent,
    ModalSchemaComponent,
    ModelComponent,
    ModalRelationComponent,
    SchemaComponent,
    BpmnDiagramComponent,
    ExpandSpecificationComponent,
    CommonUsecasesComponent,
    ChangeRequestsPanelComponent,
    DataDictionaryComponent,
    CommonSpecTableComponent,
    ProductDropdownComponent,
    SharedPipesModule,
    AddCommentOverlayPanelComponent,
    ConfirmationPopupNewComponent,
    AddCrVersionComponent,
    // DiffCompComponent,
    // DiffGeneratorComponent,
    // DiffListComponent,
    UserPersonaComponent,
    ConversationActionsComponent,
    SpecificationsHeaderComponent,
    SpecificationsMenuComponent,
    SpecGenPopupComponent,
    AddTaskComponent,
    CommentsCrPanelComponent,
    CommentsTabsComponent,
    CrTabsComponent,
    TaskListComponent,
    TaskChildConversationComponent,
    TasksPanelComponent,
    CommentsPanelComponent,
    NoCommentsComponent,
    LinkToCrComponent,
    ParaViewComponent,
    UserRolesComponent,
    ListViewComponent,
    CreateNewCrVersionComponent,
    SpecConversationComponent,
    SpecChildConversationComponent,
    MultiSelectCheckboxComponent,
    BreadcrumbsComponent,
    ImportFilePopupComponent,
    AgentOverviewComponent,
    AgentInstructionComponent,
    ImportFilePopupComponent
  ],
})
export class SharedComponentModule { }
