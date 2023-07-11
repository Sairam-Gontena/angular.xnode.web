import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UseCasesComponent } from './use-cases.component';

import { UseCasesRoutingModule } from './use-cases-routing.module';
import { PrimeModulesModule } from 'src/app/prime-modules/prime-modules.module';
// import { TemplateBuilderPublishHeaderComponent } from 'src/app/components/template-builder-publish-header/template-builder-publish-header.component';


@NgModule({
  declarations: [UseCasesComponent],
  imports: [
    CommonModule,
    UseCasesRoutingModule,
    PrimeModulesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UseCasesModule { }
