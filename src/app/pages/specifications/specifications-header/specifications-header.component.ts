import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentsService } from 'src/app/api/comments.service';
import { SpecService } from 'src/app/api/spec.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
interface Version {
  label: string;
  value: string;
}

@Component({
  selector: 'xnode-specifications-header',
  templateUrl: './specifications-header.component.html',
  styleUrls: ['./specifications-header.component.scss'],
})
export class SpecificationsHeaderComponent implements OnInit {
  @Output() getMeSpecList = new EventEmitter<any>();
  @Output() generateSpec = new EventEmitter<any>();
  versions: any;
  currentUser: any;
  metaDeta: any;
  product: any;
  isSideMenuOpened: any;
  showProductStatusPopup: boolean = false;
  showConfirmationPopup: boolean = false;
  selectedVersion: Version | undefined;
  enabledGeneratespec: boolean = true;
  showSpecGenaretePopup: any;
  isTheCurrentUserOwner: any;
  productStatusPopupContent: any;

  constructor(
    private utils: UtilsService,
    private specUtils: SpecUtilsService,
    private specService: SpecService,
    private storageService: LocalStorageService,
    private commentsService: CommentsService
  ) {}

  ngOnInit(): void {
    // To display toggle icon of side spec menu
    this.utils.openSpecSubMenu.subscribe((data: any) => {
      this.isSideMenuOpened = data;
    });
    this.getStorageData();
  }

  getStorageData() {
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.metaDeta = this.storageService.getItem(StorageKeys.MetaData);
    this.product = this.storageService.getItem(StorageKeys.Product);
    let deep_link_info = localStorage.getItem('deep_link_info');
    if (deep_link_info) {
      deep_link_info = JSON.parse(deep_link_info);
      this.getDeepLinkDetails(deep_link_info);
    } else this.getVersions();
  }

  getAllProductsInfo(key: string) {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(key);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

  getDeepLinkDetails(val: any) {
    this.getAllProductsInfo('meta_data')
      .then((result: any) => {
        if (result) {
          let products = JSON.parse(result);
          let product = products.find(
            (x: any) => x.id === val.product_id || x.id === val.productId
          );
          localStorage.setItem('record_id', product.id);
          localStorage.setItem('product', JSON.stringify(product));
          localStorage.setItem('app_name', product.title);
          localStorage.setItem('has_insights', product.has_insights);
          this.product = product;
          let deeplinkInfo = localStorage.getItem('deep_link_info');
          let version_id;
          if (deeplinkInfo) {
            let deeplinkdata = JSON.parse(deeplinkInfo);
            version_id = deeplinkdata.version_id;
          }
          this.getVersions(version_id);
          this.specUtils._openCommentsPanel(true);
          this.specUtils._tabToActive(val.template_type);
          this.specUtils._updatedSelectedProduct(true);
          localStorage.removeItem('deep_link_info');
        } else {
          console.log('not able to fetch product details');
        }
      })
      .catch((error) => {
        console.error('Error fetching data from localStorage:', error);
      });
  }

  getVersions(versionObj?: any) {
    this.versions = [];
    this.utils.loadSpinner(true);
    this.specService
      .getVersionIds(this.product?.id)
      .then((response) => {
        if (response.status === 200 && response.data) {
          this.handleVersions(response);
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'Error',
            detail: 'Network Error',
          });
        }
      })
      .catch((err: any) => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: err,
        });
      });
  }

  handleVersions(response: any) {
    this.versions = response.data;
    this.versions.forEach((element: any) => {
      element['label'] = element.specStatus + '-' + element.version;
      element['value'] = element.id;
    });
    localStorage.setItem('SPEC_VERISON', JSON.stringify(this.versions[0]));
    this.selectedVersion = this.versions[0];
    this.getMeSpecList.emit({
      productId: this.product?.id,
      versionId: this.versions[0].id,
    });
  }

  toggleSideMenu() {
    this.utils.EnableSpecSubMenu();
  }

  askConfirmationOnClickGenerate() {
    if (this.product?.id) {
      this.generateSpec.emit();
      this.enabledGeneratespec = false;
    }
  }

  viewPublishedApp() {
    let productUrl = localStorage.getItem('product_url');
    if (productUrl) {
      window.open(productUrl, '_blank');
    } else {
      alert('URL not found');
    }
  }

  openComments() {
    this.utils.disableDockedNavi();
    this.getMeAllCommentsList();
  }

  getMeAllCommentsList() {
    this.utils.loadSpinner(true);
    const specVersion: any = this.storageService.getItem(
      StorageKeys.SpecVersion
    );
    this.commentsService
      .getCommentsByProductId({
        productId: this.product?.id,
        versionId: specVersion.id,
      })
      .then((response: any) => {
        if (response.status === 200 && response.data) {
          this.specUtils._openCommentsPanel(true);
          if (response.data.length > 0)
            this.specUtils._getMeUpdatedComments(response.data);
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        console.log(err);
        this.utils.loadSpinner(false);
      });
  }

  generate() {
    this.generateSpec.emit();
  }

  onChangeProduct(obj: any): void {
    this.showSpecGenaretePopup = false;
    let product = this.metaDeta.find((x: any) => x.id === obj.id);
    if (product && product.has_insights) {
      localStorage.setItem('record_id', product.id);
      localStorage.setItem('product', JSON.stringify(product));
      localStorage.setItem('app_name', product.title);
      localStorage.setItem('has_insights', product.has_insights);
      localStorage.setItem(
        'product_url',
        obj.url && obj.url !== '' ? obj.url : ''
      );
      this.product = product;
      this.utils.loadSpinner(true);
      this.getVersions();
    } else {
      this.showGenerateSpecPopup(product);
    }
  }

  showGenerateSpecPopup(product: any) {
    if (this.currentUser.email === product?.email) {
      this.showSpecGenaretePopup = true;
      this.isTheCurrentUserOwner = true;
      this.productStatusPopupContent =
        'No spec generated for this product. Do you want to generate Spec?';
    } else {
      this.showSpecGenaretePopup = true;
      this.isTheCurrentUserOwner = false;
      this.productStatusPopupContent =
        'No spec generated for this product. You don`t have access to create the spec. Product owner can create the spec.';
    }
  }

  onClickUpdateSpec(): void {
    this.showConfirmationPopup = true;
  }

  onClickConfirmPopupAction(event: any): void {
    if (event === 'Yes') {
      this.showConfirmationPopup = false;
    } else {
      this.showConfirmationPopup = false;
    }
  }

  onVersionChange(event: any): void {
    this.versions.forEach((element: any) => {
      if (element.id === event.value.value) {
        this.storageService.saveItem(StorageKeys.SpecVersion, element);
      }
    });
    this.getMeSpecList.emit({
      productId: this.product?.id,
      versionId: event.value.value,
    });
  }
}
