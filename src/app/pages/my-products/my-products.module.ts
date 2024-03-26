import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
import { MyProductsComponent } from './my-products.component';
import { MyProductsRoutingModule } from './my-products-routing.module';
import { ProductCardsComponent } from './product-cards/product-cards.component';

@NgModule({
  declarations: [
    MyProductsComponent,
    ProductCardsComponent,
  ],
  imports: [
    CommonModule,
    MyProductsRoutingModule,
    SharedModule,
    SharedComponentModule
  ],
})
export class MyProductsModule { }
