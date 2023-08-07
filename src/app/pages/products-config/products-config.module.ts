import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsConfigRoutingModule } from './products-config-routing.module';
import { ProductsConfigComponent } from './products-config.component';
import { SharedModule } from 'primeng/api';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';


@NgModule({
  declarations: [
    ProductsConfigComponent
  ],
  imports: [
    CommonModule,
    ProductsConfigRoutingModule,

  ],
})
export class ProductsConfigModule { }
