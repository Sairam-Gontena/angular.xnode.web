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
import { TableComponent } from '../components/table/table.component';
import { TemplateBuilderPublishHeaderComponent } from '../components/template-builder-publish-header/template-builder-publish-header.component';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { SplitButtonModule } from 'primeng/splitbutton';
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
    TableComponent,
    TemplateBuilderPublishHeaderComponent,
  ],
  imports: [
    CommonModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    AccordionModule,
    DialogModule,
    DividerModule,
    FormsModule,
    SplitButtonModule
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
    TableComponent,
    TemplateBuilderPublishHeaderComponent,
  ]
})
export class SharedModule { }
