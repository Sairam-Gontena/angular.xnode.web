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
  selectedProduct: Product | undefined;
  products: Array<Product> = [];
  currentUser: any;
  email: string = '';
  myForm: FormGroup;

  constructor(
    private utilsService: UtilsService,
    private fb: FormBuilder,
    private specUtils: SpecUtilsService
  ) {
    this.myForm = this.fb.group({
      selectedProduct: [null],
    });
    this.specUtils.getMeUpdatedProduct.subscribe((data: any) => {
      if (data) {
        this.getMeDataFromStorage();
      }
    });
  }

  ngOnInit() {
    this.getMeDataFromStorage();
    this.myForm.valueChanges.subscribe((value: any) => {
      this._onChangeProduct.emit(value.selectedProduct);
      this.utilsService.saveProductDetails(value.selectedProduct);
    });
  }

  getMeDataFromStorage(): void {
    const metaData = localStorage.getItem('meta_data');
    const product = localStorage.getItem('product');
    if (metaData) {
      this.products = JSON.parse(metaData);
      if (product) {
        this.myForm.get('selectedProduct')?.patchValue(JSON.parse(product));
      } else {
        this.myForm.get('selectedProduct')?.patchValue(JSON.parse(metaData)[0]);
      }
    }
  }
}
