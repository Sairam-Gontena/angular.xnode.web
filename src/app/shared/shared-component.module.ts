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
        TemplateBuilderPublishHeaderComponent
    ],
    imports: [
        CommonModule,
        SharedModule
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
        TemplateBuilderPublishHeaderComponent
    ]
})
export class SharedComponentModule { }
