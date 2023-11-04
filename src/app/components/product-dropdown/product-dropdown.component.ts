import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { ApiService } from 'src/app/api/api.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { Router } from '@angular/router';
import { UserUtil } from 'src/app/utils/user-util';

@Component({
  selector: 'xnode-product-dropdown',
  templateUrl: './product-dropdown.component.html',
  styleUrls: ['./product-dropdown.component.scss']
})
export class ProductDropdownComponent {
  selectedProduct: any;
  product: any;
  products: any;
  productId: any;
  product_url: any;
  currentUser: any;
  email: any;

  constructor(
    private utilsService: UtilsService,
    private auditUtil: AuditutilsService,
    private router: Router,
  ) { }
  ngOnInit(): void {
    const metaData = localStorage.getItem('meta_data');
    const product = localStorage.getItem('product');
    this.productId = localStorage.getItem('record_id')
    if (product) {
      this.product = JSON.parse(product);
    }
    if (metaData) {
      this.products = JSON.parse(metaData);
      setTimeout(() => {
        this.selectedProduct = this.productId;
      }, 100)
      if (product) {
        this.selectedProduct = JSON.parse(product).id;
        this.product_url = JSON.parse(product).product_url;
      }
    }

  }
  storeProductData(id: string) {
    const product = this.products?.filter((obj: any) => { return obj.id === id })[0];
    if (product) {
      localStorage.setItem('record_id', product.id);
      localStorage.setItem('app_name', product.title);
      localStorage.setItem('product_url', product.url && product.url !== '' ? product.url : '');
      localStorage.setItem('product', JSON.stringify(product));
      this.selectedProduct = product.id;
      this.product_url = product.product_url;
    }
  }
  refreshCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      localStorage.setItem('trigger', 'graph');
      this.router.navigate([currentUrl]);
    });
  }
  selectedProducts(data: any): void {
    const product = this.products?.filter((obj: any) => { return obj.id === data.value })[0];
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
      this.selectedProduct = product.id;
      this.product_url = product.product_url;
      this.utilsService.toggleProductChange(true)
    }
    this.refreshCurrentRoute();
    this.auditUtil.postAudit("SPECIFICATIONS_PRODUCT_DROPDOWN_CHANGE", 1, 'SUCCESS', 'user-audit');
  }
}
