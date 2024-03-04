import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-product-cards',
  templateUrl: './product-cards.component.html',
  styleUrls: ['./product-cards.component.scss'],
})
export class ProductCardsComponent implements OnInit, OnChanges {
  @Output() createNewWithNavi = new EventEmitter<any>();
  @Output() onClickProductCard = new EventEmitter<any>();
  @Output() openExternalLink = new EventEmitter<any>();
  @Input() filteredProducts: any[] = [];
  @Input() end: any;
  currentUser: any;

  constructor(private storageService: LocalStorageService) {
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['end']?.currentValue) {
      this.end = changes['end']?.currentValue;
    }
  }

  onClickNew(): void {
    this.createNewWithNavi.emit();
  }
}
