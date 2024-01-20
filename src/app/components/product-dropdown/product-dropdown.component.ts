import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/models/product';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SpecUtilsService } from '../services/spec-utils.service';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
@Component({
  selector: 'xnode-product-dropdown',
  templateUrl: './product-dropdown.component.html',
  styleUrls: ['./product-dropdown.component.scss'],
})
export class ProductDropdownComponent implements OnInit {
  @Output() _onChangeProduct = new EventEmitter<object>();
  selectedProduct: any;
  products?: Array<Product> = [];
  product: any;

  constructor(
    private fb: FormBuilder,
    private specUtils: SpecUtilsService,
    private storageService: LocalStorageService
  ) {
    this.specUtils.getMeUpdatedProduct.subscribe((data: any) => {
      if (data) {
        this.ngOnInit()
      }
    });
  }

  ngOnInit() {
    this.products = this.storageService.getItem(StorageKeys.MetaData);
    const product = this.storageService.getItem(StorageKeys.Product);
    if (product) {
      this.selectedProduct = product;
    }
  }
  onChangeProduct(event: any): void {
    this.selectedProduct = event.value;
    this._onChangeProduct.emit(event.value);
  }
}
