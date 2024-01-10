import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { Product } from 'src/models/product';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SpecUtilsService } from '../services/spec-utils.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
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
  getMeDataFromStoragesubject: Subject<boolean> = new Subject<boolean>();
  myFormValueChanges: Subject<any> = new Subject<any>();

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
        this.getMeDataFromStoragesubject.next(true);
        // this.getMeDataFromStorage();
      }
    });
    // reason in spec header product is setting in localstorage 1st item this._onChangeProduct.emit(value.selectedProduct) because this is emitting first obj here this.specUtils.getMeUpdatedProduct.subscribe calling multiple times dont know from where
    this.getMeDataFromStoragesubject.pipe(debounceTime(1000)).subscribe((search) => {
      this.getMeDataFromStorage();
    });
    this.myFormValueChanges.pipe(debounceTime(1000)).subscribe((value:any) => {
      this._onChangeProduct.emit(value.selectedProduct);
      this.utilsService.saveProductDetails(value.selectedProduct);
    });
  }

  ngOnInit() {
    this.getMeDataFromStorage();
    this.myForm.valueChanges.subscribe((value: any) => {
      this.myFormValueChanges.next(value)
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
