import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilsService } from '../services/utils.service';
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
  email: string = '';
  myForm: FormGroup;

  constructor(
    private utilsService: UtilsService,
    private fb: FormBuilder,
    private specUtils: SpecUtilsService
  ) {
    this.myForm = this.fb.group({ selectedProduct: [null], });
    this.specUtils.getMeUpdatedProduct.subscribe((data: any) => {
      if (data) {
        this.getMeDataFromStorage();
      }
    });
  }

  ngOnInit() {
    this.getMeDataFromStorage();
    const metaData = localStorage.getItem('meta_data');
    if (metaData) {
      this.products = JSON.parse(metaData);
    }
    this.myForm.valueChanges.subscribe((value: any) => {
      this.selectedProduct = value.selectedProduct;
      this._onChangeProduct.emit(this.selectedProduct);
      this.utilsService.saveProductDetails(this.selectedProduct);
    });
  }

  getMeDataFromStorage(): void {
    const product = localStorage.getItem('product');
    if (this.products) {
      if (product) {
        this.selectedProduct = JSON.parse(product);
        this.myForm.patchValue({ 'selectedProduct': this.products.find((item: any) => item.id == this.selectedProduct.id) })
      } else {
        this.selectedProduct = this.products[0];
        this.myForm.patchValue({ 'selectedProduct': this.selectedProduct })
      }
    }
  }
}
