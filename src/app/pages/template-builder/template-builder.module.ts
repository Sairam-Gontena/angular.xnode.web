import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateBuilderRoutingModule } from './template-builder-routing.module';
import { TemplateBuilderComponent } from './template-builder.component';
import { GridsterModule } from 'angular-gridster2';
import { TemplateBuilderPublishHeaderComponent } from 'src/app/components/template-builder-publish-header/template-builder-publish-header.component';
import { PrimeModulesModule } from '../../prime-modules/prime-modules.module';

@NgModule({
  declarations: [
    TemplateBuilderComponent,
    TemplateBuilderPublishHeaderComponent
  ],
  imports: [
    CommonModule,
    TemplateBuilderRoutingModule,
    GridsterModule,
    PrimeModulesModule
  ],
  exports: [
    GridsterModule
  ]
})
export class TemplateBuilderModule { }
