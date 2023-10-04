import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'xnode-specifications-header',
  templateUrl: './specifications-header.component.html',
  styleUrls: ['./specifications-header.component.scss']
})
export class SpecificationsHeaderComponent implements OnInit {
  @Output() refreshCurrentRoute = new EventEmitter<any>();

  currentUser: any;
  templates: any;
  selectedTemplate: any;
  product_url: any;
  utilsService: any;
  auditUtil: any;
  product: any;


  constructor(private router: Router,) {
  }
  ngOnInit(): void {
    let user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user)
    }
    const metaData = localStorage.getItem('meta_data');
    const product = localStorage.getItem('product');
    if (product) {
      this.product = JSON.parse(product);
    }
    if (metaData) {
      this.templates = JSON.parse(metaData);
      if (product) {
        this.selectedTemplate = JSON.parse(product).id;
        this.product_url = JSON.parse(product).product_url;
      }
    }

  }
  getMeUserAvatar() {
    var firstLetterOfFirstWord = this.currentUser.first_name[0][0].toUpperCase(); // Get the first letter of the first word
    var firstLetterOfSecondWord = this.currentUser.last_name[0][0].toUpperCase(); // Get the first letter of the second word
    return firstLetterOfFirstWord + firstLetterOfSecondWord
  }
  selectedProduct(data: any): void {
    const product = this.templates?.filter((obj: any) => { return obj.id === data.value })[0];
    if (product) {
      localStorage.setItem('record_id', product.id);
      localStorage.setItem('app_name', product.title);
      localStorage.setItem('product_url', product.url && product.url !== '' ? product.url : '');
      localStorage.setItem('product', JSON.stringify(product));
      this.selectedTemplate = product.id;
      this.product_url = product.product_url;
    }
    this.refreshCurrentRoute.emit();
    this.auditUtil.post("SPECIFICATIONS_PRODUCT_DROPDOWN_CHANGE", 1, 'SUCCESS', 'user-audit');
  }
}
