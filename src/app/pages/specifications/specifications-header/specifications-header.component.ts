import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommentsService } from 'src/app/api/comments.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { SpecificationsService } from 'src/app/services/specifications.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { SpecVersion } from 'src/models/spec-versions';
import { SpecificationUtilsService } from '../../diff-viewer/specificationUtils.service';
@Component({
  selector: 'xnode-specifications-header',
  templateUrl: './specifications-header.component.html',
  styleUrls: ['./specifications-header.component.scss'],
})
export class SpecificationsHeaderComponent implements OnInit {
  @Output() getMeSpecList = new EventEmitter<any>();
  @Output() generateSpec = new EventEmitter<any>();
  @Output() onDiffViewChange = new EventEmitter<any>();
  @Output() onVersionChange = new EventEmitter<any>();
  @Input() versions: SpecVersion[] = [];
  @Input() onDiffValue:any;
  selectedVersion: SpecVersion | undefined;
  currentUser: any;
  metaDeta: any;
  product: any;
  isSideMenuOpened: any;
  showConfirmationPopup: boolean = false;
  enabledGeneratespec: boolean = true;
  diffView: boolean = false;
  viewType: any;
  showSpecGenaretePopup: any;
  isTheCurrentUserOwner: any;
  productStatusPopupContent: any;
  viewList: any = [
    { label: 'Inline View', value: 'line-by-line' },
    { label: 'Side By Side View', value: 'side-by-side' },
    { label: 'Exit', value: null },
  ];
  selectedView: any;
  specData: any;
  isCommentsPanelOpened: any;
  showingCRList: any;
  conversationPanelInfo: any;

  constructor(
    private utils: UtilsService,
    private specUtils: SpecUtilsService,
    private storageService: LocalStorageService,
    private commentsService: CommentsService,
    private specService: SpecificationsService,
    private SpecificationUtils: SpecificationUtilsService
  ) {
    this.SpecificationUtils._openConversationPanel.subscribe((data: any) => {
      if (data) {
        this.conversationPanelInfo = data;
      }
    });
  }

  ngOnInit(): void {
    this.specData = this.storageService.getItem(StorageKeys.SPEC_DATA);
    this.getStorageData();
    if(this.onDiffValue){
      this.diffView = true;
      this.toggleDiffView(true)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.versions = changes['versions'].currentValue;
    this.selectedVersion = changes['versions'].currentValue[0];
  }

  getStorageData() {
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.metaDeta = this.storageService.getItem(StorageKeys.MetaData);
    this.product = this.storageService.getItem(StorageKeys.Product);
    // let deep_link_info = localStorage.getItem('deep_link_info');
    // if (deep_link_info) {
    //   deep_link_info = JSON.parse(deep_link_info);
    //   this.getDeepLinkDetails(deep_link_info);
    // } else this.getVersions();
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
    const version: any = this.storageService.getItem(StorageKeys.SpecVersion);
    this.SpecificationUtils.openConversationPanel({
      openConversationPanel: true,
      parentTabIndex: 0,
      childTabIndex: 0,
    });
    this.specService.getMeAllComments({
      productId: this.product.id,
      versionId: version.id,
    });
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
    this.utils.loadSpinner(true);
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
      this.specService.getVersions(this.product.id, (data) => {
        this.specService.getMeSpecInfo(
          {
            productId: this.product?.id,
            versionId: data[0].id,
          },
          (specData) => {
            if (specData) {
              if (
                this.conversationPanelInfo?.openConversationPanel &&
                this.conversationPanelInfo?.parentTabIndex === 0 &&
                this.conversationPanelInfo?.childTabIndex === 0
              ) {
                this.specService.getMeAllComments({
                  productId: this.product?.id,
                  versionId: data[0].id,
                });
              } else if (
                this.conversationPanelInfo?.openConversationPanel &&
                this.conversationPanelInfo?.parentTabIndex === 0 &&
                this.conversationPanelInfo?.childTabIndex === 1
              ) {
                this.specService.getMeAllTasks({
                  productId: this.product?.id,
                  versionId: data[0].id,
                });
              } else if (
                this.conversationPanelInfo?.openConversationPanel &&
                this.conversationPanelInfo?.parentTabIndex === 1
              ) {
                this.specService.getMeCrList({ productId: this.product?.id });
              }
            }
          }
        );
        this.storageService.saveItem(StorageKeys.SpecVersion, data[0]);
      });
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
    this.onVersionChange.emit({  diffView: this.diffView, });
    this.versions.forEach((element: any) => {
      if (element.id === event.value.value) {
        this.storageService.saveItem(StorageKeys.SpecVersion, element);
      }
    });
    this.specService.getMeSpecInfo({
      productId: this.product?.id,
      versionId: event.value.value,
    });
    if (
      this.conversationPanelInfo?.openConversationPanel &&
      this.conversationPanelInfo?.parentTabIndex === 0 &&
      this.conversationPanelInfo?.childTabIndex === 0
    ) {
      console.log('>>>>>>');

      this.specService.getMeAllComments({
        productId: this.product?.id,
        versionId: event.value.value,
      });
    } else if (
      this.conversationPanelInfo?.openConversationPanel &&
      this.conversationPanelInfo?.parentTabIndex === 0 &&
      this.conversationPanelInfo?.childTabIndex === 1
    ) {
      this.specService.getMeAllTasks({
        productId: this.product?.id,
        versionId: event.value.value,
      });
    } else if (
      this.conversationPanelInfo?.openConversationPanel &&
      this.conversationPanelInfo?.parentTabIndex === 1
    ) {
      this.specService.getMeCrList({ productId: this.product?.id });
    }
  }
  onViewChange(event: any) {
    this.viewType = event.value;
    if (!event.value) {
      this.diffView = false;
    }
    this.onDiffViewChange.emit({
      diffView: !event.value ? false : this.diffView,
      viewType: event.value,
    });
  }

  toggleDiffView(ele: any): void {
    if (this.diffView) {
      this.viewType = 'line-by-line';
    } else {
      this.viewType = null; // Set to null or any other default value when the switch is off
    }
    this.onDiffViewChange.emit({
      diffView: this.diffView,
      viewType: this.viewType,
    });
  }
}
