import { Component, Input } from '@angular/core';
import { UserUtil } from '../../utils/user-util';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import * as data from '../../constants/overview.json';
@Component({
  selector: 'xnode-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})

export class OverViewComponent {
  @Input() currentStep: number = 2;
  loading: boolean = true;
  templates: any;
  appName = localStorage.getItem('app_name');
  highlightedIndex: string | null = null;
  iconClicked: any;
  stepper: any;
  show = false;
  counter: any = 1;
  counter2: any = 1;
  jsondata: any;
  childData: any;
  currentUser?: any;
  overview: any;
  features: any;
  createOn: any;
  overviewData: any;
  product: any;
  username: string = '';

  constructor(
    private storageService: LocalStorageService,
  ) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    this.jsondata = data?.data;
    this.getMeStorageData();
  }

  getMeStorageData(): void {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
  }

  onChangeProduct(obj: any): void {
    this.getMeStorageData();
  }
}
