import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/models/product';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SpecUtilsService } from '../services/spec-utils.service';
@Component({
  selector: 'xnode-product-dropdown',
  templateUrl: './product-dropdown.component.html',
  styleUrls: ['./product-dropdown.component.scss'],
})
export class ProductDropdownComponent implements OnInit {
  @Output() _onChangeProduct = new EventEmitter<object>();
  selectedProduct: any;
  products: Array<Product> = [];
  currentUser: any;
  product:any;
  email: string = '';
  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private specUtils: SpecUtilsService
  ) {
    this.myForm = this.fb.group({ selectedProduct: [null] });
    this.specUtils.getMeUpdatedProduct.subscribe((data: any) => {
      if (data) {
        this.ngOnInit()
      }
    });
  }

  ngOnInit() {
    const metaData = localStorage.getItem('meta_data');
    if (metaData) {
      this.products = JSON.parse(metaData);
    }
    this.product = localStorage.getItem('product');
    this.getMeDataFromStorage();
  }
  onChangeProduct(event: any): void {
    this.selectedProduct = event.value;
    this._onChangeProduct.emit(event.value);
  }

  getMeDataFromStorage(): void {
    if (this.products) {
      if (this.product) {
        setTimeout(() => {
          this.product = localStorage.getItem('product');
          this.selectedProduct = JSON.parse(this.product);
          this.myForm.patchValue({
            selectedProduct: this.products.find(
              (item: any) => item.id == this.selectedProduct.id
            ),});
        }, 0);
      } else {
        setTimeout(() => {
          this.selectedProduct = this.products[0];
          this.myForm.patchValue({ selectedProduct: this.selectedProduct });
        }, 0);
      }
    }
  }
}
