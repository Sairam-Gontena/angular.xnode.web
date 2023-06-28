import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageToolsLayoutComponent } from './page-tools-layout.component';
import { PageToolsLayoutRoutingModule } from './page-tools-layout-routing.module';
import { PrimeModulesModule } from '../../prime-modules/prime-modules.module';
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PageToolsLayoutRoutingModule,
    PrimeModulesModule
  ],
  exports: [
  ]
})
export class PageToolsLayoutModule { }
