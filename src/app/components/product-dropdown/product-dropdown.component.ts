import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
} from '@angular/core';
import { Product } from 'src/models/product';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
@Component({
  selector: 'xnode-product-dropdown',
  templateUrl: './product-dropdown.component.html',
  styleUrls: ['./product-dropdown.component.scss'],
})
export class ProductDropdownComponent implements OnInit {
  @Output() _onChangeProduct = new EventEmitter<object>();
  @Input() selectedProduct: any;
  products?: Array<Product> = [];
  product: any;

  constructor(private storageService: LocalStorageService) {}

  ngOnInit() {
    this.products = this.storageService.getItem(StorageKeys.MetaData);
    const product = this.storageService.getItem(StorageKeys.Product);
    if (product) {
      this.selectedProduct = product;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProduct']?.currentValue) {
      this.products = this.storageService.getItem(StorageKeys.MetaData);
      this.selectedProduct = changes['selectedProduct']?.currentValue;
    }
  }
  onChangeProduct(event: any): void {
    this.selectedProduct = event.value;
    this._onChangeProduct.emit(event.value);
  }
}
