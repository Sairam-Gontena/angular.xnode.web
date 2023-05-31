import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateBuilderRoutingModule } from './template-builder-routing.module';
import { TemplateBuilderComponent } from './template-builder.component';
import { GridsterModule } from 'angular-gridster2';
import { TemplateBuilderPublishHeaderComponent } from 'src/app/components/template-builder-publish-header/template-builder-publish-header.component';
import { PrimeModulesModule } from '../../prime-modules/prime-modules.module';
import { LayoutElementsComponent } from 'src/app/components/layout-elements/layout-elements.component';
import { TemplateHeaderComponent } from 'src/app/components/template-header/template-header.component';
import { TemplateSideMenuComponent } from 'src/app/components/template-side-menu/template-side-menu.component';

import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';

@NgModule({
  declarations: [
    TemplateBuilderComponent,
    TemplateBuilderPublishHeaderComponent,
    LayoutElementsComponent,
    TemplateHeaderComponent,
    TemplateSideMenuComponent,
  ],
  imports: [
    CommonModule,
    TemplateBuilderRoutingModule,
    GridsterModule,
    PrimeModulesModule,
    MenubarModule,
    PanelMenuModule,
    ButtonModule,
  ],
  exports: [
    GridsterModule
  ]
})
export class TemplateBuilderModule { }
