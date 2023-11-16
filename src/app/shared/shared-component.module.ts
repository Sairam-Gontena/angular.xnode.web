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
import { NotificationPanelComponent } from '../components/notification-panel/notification-panel.component'
import { ConfirmationPopupComponent } from '../components/confirmation-popup/confirmation-popup.component';
import { ReportBugComponent } from '../components/report-bug/report-bug.component';
import { CustomerFeedbackComponent } from '../components/customer-feedback/customer-feedback.component';
import { ThankYouComponent } from '../components/thank-you/thank-you.component';
import { GeneralFeedbackComponent } from '../components/general-feedback/general-feedback.component';
import { ActionButtonComponent } from '../components/action-button/action-button.component';
import { ViewExistingFeedbackComponent } from '../components/view-existing-feedback/view-existing-feedback.component';
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
                AddCommentOverlayPanelComponent
        ],
        imports: [
                CommonModule,
                SharedModule,
                SharedPipesModule
        ],
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
                AddCommentOverlayPanelComponent
        ]
})
export class SharedComponentModule { }
