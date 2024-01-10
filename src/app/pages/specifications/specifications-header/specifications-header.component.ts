import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentsService } from 'src/app/api/comments.service';
import { SpecService } from 'src/app/api/spec.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { SpecificationsService } from 'src/app/services/specifications.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { SpecificationUtilsService } from '../../diff-viewer/specificationUtils.service';
import { SpecVersion } from 'src/models/spec-versions';
@Component({
  selector: 'xnode-specifications-header',
  templateUrl: './specifications-header.component.html',
  styleUrls: ['./specifications-header.component.scss'],
})
export class SpecificationsHeaderComponent implements OnInit {
  @Output() getMeSpecList = new EventEmitter<any>();
  @Output() generateSpec = new EventEmitter<any>();
  @Output() onDiffViewChange = new EventEmitter<any>();

  versions: SpecVersion[] = [];
  selectedVersion: SpecVersion | undefined;
  currentUser: any;
  metaDeta: any;
  product: any;
  isSideMenuOpened: any;
  showConfirmationPopup: boolean = false;
  enabledGeneratespec: boolean = true;
  diffView: boolean = false;
  showSpecGenaretePopup: any;
  isTheCurrentUserOwner: any;
  productStatusPopupContent: any;
  viewList: any = [
    { label: 'Inline View', value: 'INLINE VIEW' },
    { label: 'Side By Side View', value: 'SIDE BY SIDE VIEW' },
    { label: 'Exit', value: 'EXIT' },
  ];
  selectedView: any;

  specData: any;
  isCommentsPanelOpened: any;
  showingCRList: any;

  constructor(
    private utils: UtilsService,
    private specUtils: SpecUtilsService,
    private specApiService: SpecService,
    private storageService: LocalStorageService,
    private commentsService: CommentsService,
    private specService: SpecificationsService,
    private specificationUtils: SpecificationUtilsService
  ) {
    this.specificationUtils.getMeVersions.subscribe(
      (versions: SpecVersion[]) => {
        this.versions = versions;
        this.versions.forEach((element: any) => {
          element['label'] = element.specStatus + '-' + element.version;
          element['value'] = element.id;
        });
        this.selectedVersion = versions[0];
        console.log('this.selectedVersion', this.selectedVersion);
      }
    );
    // this.specUtils.openCommentsPanel.subscribe((event: any) => {
    //   this.isCommentsPanelOpened = event;
    // });
    // this.specUtils.loadActiveTab.subscribe((event) => {
    //   if (event === 1) {
    //     this.showingCRList = true;
    //   } else {
    //     this.showingCRList = false;
    //   }
    // });
    // this.utils.openSpecSubMenu.subscribe((data: any) => {
    //   this.isSideMenuOpened = data;
    // });
  }

  ngOnInit(): void {
    this.specData = this.storageService.getItem(StorageKeys.SPEC_DATA);
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
          this.getVersions();
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

  getVersions() {
    this.utils.loadSpinner(true);
    this.specService.getVersions(this.product.id, (data) => {
      this.specService.getMeSpecInfo({
        productId: this.product?.id,
        versionId: data[0].id,
      });
    });
  }

  getMeCrList() {
    let body: any = {
      productId: this.product.id,
    };
    this.utils.loadSpinner(true);
    this.commentsService
      .getCrList(body)
      .then((res: any) => {
        if (res && res.data) {
          this.specUtils._openCommentsPanel(true);
          this.specUtils._loadActiveTab(1);
          this.specUtils._getMeUpdatedCrs(res.data);
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res?.data?.common?.status,
          });
        }
        this.utils.loadSpinner(false);
      })
      .catch((err: any) => {
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
        this.utils.loadSpinner(false);
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

  onChangeVersion(event: any): void {
    this.utils.loadSpinner(true);
    this.versions.forEach((element: any) => {
      if (element.id === event.value.value) {
        this.storageService.saveItem(StorageKeys.SpecVersion, element);
      }
    });
    this.specService.getMeSpecInfo({
      productId: this.product?.id,
      versionId: event.value.value,
    });
  }
  onViewChange(event: any) {
    if (event.value.value === 'INLINE VIEW') {
      console.log(event.value);
    } else if (event.value.value === 'EXIT') {
      this.diffView = false;
    }
  }
  toggleDiffView(ele: any): void {
    if (this.diffView) {
      this.selectedView = this.viewList.find(
        (view: any) => view.value === 'INLINE VIEW'
      );
    } else {
      this.selectedView = null; // Set to null or any other default value when the switch is off
    }
    this.onDiffViewChange.emit(this.diffView);
  }
}
