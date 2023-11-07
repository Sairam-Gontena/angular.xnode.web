import { AfterViewInit, Component } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { Product } from 'src/models/product';



@Component({
  selector: 'xnode-product-dropdown',
  templateUrl: './product-dropdown.component.html',
  styleUrls: ['./product-dropdown.component.scss']
})
export class ProductDropdownComponent implements AfterViewInit {
  selectedProduct?: any;
  product?: Product;
  products: Array<Product> = [];
  product_url: any;
  currentUser: any;
  email: any;

  constructor(
    private utilsService: UtilsService,
    private auditUtil: AuditutilsService,
  ) {
    this.getMeProductMetaData()
  }


  ngAfterViewInit() {
  }
  getMeProductMetaData() {
    const metaData = localStorage.getItem('meta_data');
    const product = localStorage.getItem('product');
    if (product) {
      console.log(product)
      this.product = JSON.parse(product);
      this.selectedProduct = this.product;
      this.product_url = JSON.parse(product).product_url;
    }
    if (metaData) {
      this.products = JSON.parse(metaData);
    }
  }

  onChangeProduct(data: any): void {
    if (!data.value) {
      return
    }
    const product = data.value;
    if (this.currentUser?.email == product.email) {
      this.utilsService.hasProductPermission(true)
    } else {
      this.utilsService.hasProductPermission(false)
    }
    if (product) {
      localStorage.setItem('record_id', product.id);
      localStorage.setItem('app_name', product.title);
      localStorage.setItem('product_url', product.url && product.url !== '' ? product.url : '');
      localStorage.setItem('product', JSON.stringify(product));
      this.product_url = product.product_url;
      this.utilsService.saveProductDetails(product);
      this.utilsService.toggleProductChange(true)
    }
    this.auditUtil.postAudit("SPECIFICATIONS_PRODUCT_DROPDOWN_CHANGE", 1, 'SUCCESS', 'user-audit');
  }
}
