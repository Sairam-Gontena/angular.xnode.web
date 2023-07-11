import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateBuilderRoutingModule } from './template-builder-routing.module';
import { TemplateBuilderComponent } from './template-builder.component';
import { GridsterModule } from 'angular-gridster2';
import { TemplateBuilderPublishHeaderComponent } from 'src/app/components/template-builder-publish-header/template-builder-publish-header.component';
import { PrimeModulesModule } from '../../prime-modules/prime-modules.module';
import { PageToolsLayoutComponent } from 'src/app/components/page-tools-layout/page-tools-layout.component';
import { LayoutElementsComponent } from 'src/app/components/layout-elements/layout-elements.component';
@NgModule({
  declarations: [
    TemplateBuilderComponent,
    TemplateBuilderPublishHeaderComponent,
    PageToolsLayoutComponent,
    LayoutElementsComponent
  ],
  imports: [
    CommonModule,
    TemplateBuilderRoutingModule,
    GridsterModule,
    PrimeModulesModule
  ],
  exports: [
    GridsterModule,
    PageToolsLayoutComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class TemplateBuilderModule { }
