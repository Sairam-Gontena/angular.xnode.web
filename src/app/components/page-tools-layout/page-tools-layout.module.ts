import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutElementsComponent } from '../layout-elements/layout-elements.component';
import { PageToolsLayoutComponent } from './page-tools-layout.component';
import { PageToolsLayoutRoutingModule } from './page-tools-layout-routing.module';
import { PrimeModulesModule } from '../../prime-modules/prime-modules.module';
@NgModule({
  declarations: [
    LayoutElementsComponent
  ],
  imports: [
    CommonModule,
    PageToolsLayoutRoutingModule,
    PrimeModulesModule
  ],
  exports: [
    PageToolsLayoutComponent
  ]
})
export class PageToolsLayoutModule { }
