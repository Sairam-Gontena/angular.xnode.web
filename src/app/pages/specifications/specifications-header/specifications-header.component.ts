import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { SpecificationsService } from 'src/app/services/specifications.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { SpecVersion } from 'src/models/spec-versions';
import { SpecificationUtilsService } from '../../diff-viewer/specificationUtils.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { ConversationHubService } from 'src/app/api/conversation-hub.service';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'xnode-specifications-header',
  templateUrl: './specifications-header.component.html',
  styleUrls: ['./specifications-header.component.scss'],
})
export class SpecificationsHeaderComponent implements OnInit {
  @Output() getMeSpecList = new EventEmitter<any>();
  @Output() generateSpec = new EventEmitter<any>();
  @Output() onDiffViewChange = new EventEmitter<any>();
  @Output() emitProductChange = new EventEmitter<any>();
  @Input() versions: SpecVersion[] = [];
  @Input() onDiffValue: any;
  @Input() selectedVersion: SpecVersion | undefined;
  @Output() isMeneOpened: EventEmitter<any> = new EventEmitter();
  @Input() isSideMenuOpened?: any;
  @Input() conversationPanelInfo: any;
  isDockedNaviEnabled?: boolean = false;
  currentUser: any;
  metaDeta: any;
  product: any;
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
  specData: any;
  value: any;
  references: any;
  userList: Array<{}> = new Array();
  suggestions: any;
  selectedItem: any;
  addShareForm: FormGroup;
  checkDeepLinkCopied: boolean = false;
  enableCommonModal: boolean = false;
  commonModalDetail: any = {
    visible: false,
    modal: true,
    modalClass: "",
    responsive: true,
    breakpoints: { '900px': '50vw', '600px': '100vw' },
    style: { width: "50vw", "max-height": "70vh" }
  }
  sharedLinkDetail: any = {
    getUserList: new Array(),
    selectedUserList: new Array(),
    showSelectedUserChip: new Array(),
    removeUserChip: "",
    removeUserAccess: false,
    iniviteType: "",
    currentShareDetailData: "",
    inviteList: [{ name: 'Owner', code: 'Owner', caption: 'Can provide access to others' },
    { name: 'Contributor', code: 'Contributor', caption: 'Can access in edit mode' },
    { name: 'Reader', code: 'Reader', caption: 'Can access in read only mode' }],
    snackMessage: {
      enable: false,
      closable: false,
      message: new Array()
    }
  }

  constructor(private utilsService: UtilsService,
    private specUtils: SpecUtilsService,
    private storageService: LocalStorageService,
    private specService: SpecificationsService,
    private SpecificationUtils: SpecificationUtilsService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private conversationHubService: ConversationHubService,
  ) {
    this.SpecificationUtils._openConversationPanel.subscribe((data: any) => {
      if (data) {
        this.conversationPanelInfo = data;
        this.product = this.storageService.getItem(StorageKeys.Product);
        this.selectedVersion = this.storageService.getItem(StorageKeys.SpecVersion);
      }
    });
    this.utilsService.getMeProductId.subscribe((data) => {
      if (data) {
        this.product = this.storageService.getItem(StorageKeys.Product);
      }
    })
    this.addShareForm = this.fb.group({
      files: [[]],
    });
    this.references = [];
  }

  ngOnInit(): void {
    this.getStorageData();
    if (this.onDiffValue) {
      if (this.onDiffValue.onDiff) this.diffView = true;
      if (this.onDiffValue.viewType) this.viewType = this.onDiffValue.viewType;
    }
    this.getUserListExceptCurrent(); //get userlist except current user
    this.utilsService.openDockedNavi.subscribe((res: boolean) => {
      this.isDockedNaviEnabled = res;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSideMenuOpened']?.currentValue) {
      this.isSideMenuOpened = changes['isSideMenuOpened'].currentValue;
    }
    if (changes['versions']?.currentValue) {
      this.versions = changes['versions'].currentValue;
    }
    if (changes['selectedVersion']?.currentValue) {
      this.selectedVersion = changes['selectedVersion'].currentValue;
    }
  }

  //get userlist except current user
  getUserListExceptCurrent() {
    let userList: any = this.localStorageService.getItem(StorageKeys.USERLIST);
    if (userList && userList.length) {
      userList.forEach((element: any) => {
        if (element.user_id !== this.currentUser.user_id) {
          element.active = false;
          element.name = element.first_name + ' ' + element.last_name;
          this.userList.push(element);
        }
      });
    }
  }

  getStorageData() {
    this.specData = this.storageService.getItem(StorageKeys.SPEC_DATA);
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.metaDeta = this.storageService.getItem(StorageKeys.MetaData);
    this.product = this.storageService.getItem(StorageKeys.Product);
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
    this.getAllProductsInfo('meta_data').then((result: any) => {
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
    }).catch((error) => {
      console.error('Error fetching data from localStorage:', error);
    });
  }

  toggleSideMenu() {
    this.isMeneOpened.emit(true);
  }

  search(event: AutoCompleteCompleteEvent) {
    this.suggestions = [...Array(10).keys()].map(
      (item) => event.query + '-' + item
    );
  }

  askConfirmationOnClickGenerate() {
    if (this.product?.id) {
      this.generateSpec.emit();
      this.enabledGeneratespec = false;
    }
  }

  viewPublishedApp() {
    if (this.product.product_url) {
      window.open(this.product?.product_url, '_blank');
    } else {
      alert('URL not found');
    }
  }

  openComments() {
    this.utilsService.disableDockedNavi();
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

  generate() {
    this.generateSpec.emit();
  }

  onChangeProduct(obj: any): void {
    this.showSpecGenaretePopup = false;
    this.utilsService.loadSpinner(true);
    let product = this.metaDeta.find((x: any) => x.id === obj.id);
    this.specService.getMeCrList({ productId: product?.id });
    if (product) {
      this.emitProductChange.emit(obj)
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
    this.utilsService.loadSpinner(true);
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

  //get deep link
  getDeeplinkURL() {
    let url: string = window.location.href + "?";
    let params: any = {
      product_id: this.selectedVersion?.productId,
      version_id: this.selectedVersion?.id,
      entity: 'SPEC'
    };
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, params[key]);
    });
    return url = url + httpParams;
  }

  //copy the link
  copyLink() {
    this.checkDeepLinkCopied = true;
    let inputText = document.createElement('input');
    inputText.style.position = 'fixed';
    inputText.style.left = '0';
    inputText.style.top = '0';
    inputText.style.opacity = '0';
    inputText.value = this.getDeeplinkURL();
    document.body.appendChild(inputText);
    inputText.focus();
    inputText.select();
    document.execCommand('copy');
    document.body.removeChild(inputText);
  }

  //make shared link detail
  makeSharedLinkDetail() {
    this.sharedLinkDetail.selectedUserList = new Array();
    this.sharedLinkDetail.showSelectedUserChip = new Array();
    this.sharedLinkDetail.getUserList = this.userList;
    if (this.sharedLinkDetail.currentShareDetailData?.users?.length) {
      this.sharedLinkDetail.currentShareDetailData.users.forEach((element: any) => {
        if (element.userId !== this.currentUser?.user_id) {
          let getUser: any = this.userList?.find((item: any) => item.user_id === element.userId);
          if (element.active === undefined || element.active === true) {
            getUser.active = true;
            this.sharedLinkDetail.selectedUserList.push(getUser);
            this.sharedLinkDetail.showSelectedUserChip.push(getUser);
            this.sharedLinkDetail.getUserList = this.sharedLinkDetail.getUserList?.filter((item: any) => item.user_id !== element.userId);
          } else {
            this.sharedLinkDetail.showSelectedUserChip = this.sharedLinkDetail.showSelectedUserChip?.filter((item: any) => item.user_id !== element.userId);
          }
        }
      });
    }
    if (this.sharedLinkDetail.snackMessage.enable) {
      this.sharedLinkDetail.snackMessage.closable = true;
      this.sharedLinkDetail.snackMessage.message.push({ severity: 'success', summary: '', detail: this.sharedLinkDetail.removeUserAccess ? "Updated successfully" : "Invited Successfully." });
      setTimeout(() => {
        this.sharedLinkDetail.snackMessage.closable = false;
        this.sharedLinkDetail.snackMessage.message = new Array();
        this.sharedLinkDetail.snackMessage.enable = false;
      }, 2000);
    }
    this.sharedLinkDetail = Object.assign({}, this.sharedLinkDetail);
  }

  //make users list in payload
  makePayloadUsers(userArr: any, deepLink: string) {
    if (!this.sharedLinkDetail.removeUserAccess && this.sharedLinkDetail.selectedUserList && this.sharedLinkDetail.selectedUserList.length) {
      this.sharedLinkDetail.selectedUserList.forEach((element: any) => {
        userArr.push({ userId: element.user_id, role: this.sharedLinkDetail.iniviteType.code, deepLink: deepLink });
      });
    }
    if (this.sharedLinkDetail.removeUserAccess) {
      this.sharedLinkDetail.showSelectedUserChip.forEach((element: any) => {
        if (element.user_id !== this.sharedLinkDetail.removeUserChip.user_id) {
          userArr.push({ userId: element.user_id, role: this.sharedLinkDetail.iniviteType.code, deepLink: deepLink });
        }
      });
      this.sharedLinkDetail.showSelectedUserChip = this.sharedLinkDetail.showSelectedUserChip.filter((item: any) => item.user_id !== this.sharedLinkDetail.removeUserChip.user_id);
    }
    return userArr;
  }

  //invite the user
  inviteRemoveUser() {
    let paramPayload: any = {
      param: { id: this.sharedLinkDetail.currentShareDetailData.id },
      payload: { users: new Array() }
    },
      getDeepLink = this.getDeeplinkURL();
    paramPayload.payload.users.push({ userId: this.currentUser?.user_id, role: "Owner" });
    paramPayload.payload.users = this.makePayloadUsers(paramPayload.payload.users, getDeepLink);
    this.utilsService.loadSpinner(true);
    this.conversationHubService.patchProduct(this.product.id, paramPayload.payload).subscribe((response: any) => {
      if (response) {
        this.sharedLinkDetail.currentShareDetailData = response;
        this.sharedLinkDetail.snackMessage.enable = true;
        this.makeSharedLinkDetail();
        if (this.sharedLinkDetail.removeUserAccess) {
          this.sharedLinkDetail.removeUserAccess = false;
          this.utilsService.loadSpinner(false);
        }
        const product: any = this.storageService.getItem(StorageKeys.Product);
        product.users = response.users;
        this.storageService.saveItem(StorageKeys.Product, product);
        this.utilsService.loadSpinner(false);
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'Error', detail: response.details });
        this.utilsService.loadSpinner(false);
      }
    }, (error) => {
      this.utilsService.loadToaster({ severity: 'error', summary: 'Error', detail: error });
      this.utilsService.loadSpinner(false);
    })
  }

  //share the event
  shareEvent() {
    const product = this.storageService.getItem(StorageKeys.Product)
    this.enableCommonModal = true;
    this.commonModalDetail.visible = true;
    this.sharedLinkDetail.currentShareDetailData = product;
    this.makeSharedLinkDetail();
  }

  //filtered suggestion list
  filteredReveiwer(eventData: any) {
    let filtered: any[] = [];
    let query = eventData.query;
    const selectedReviewers = eventData?.data.map((reviewer: any) => reviewer.name.toLowerCase());
    filtered = this.sharedLinkDetail.getUserList.filter((reviewer: any) =>
      reviewer.name.toLowerCase().includes(query.toLowerCase()) && !selectedReviewers.includes(reviewer.name.toLowerCase()));
    this.sharedLinkDetail.suggestionList = filtered && filtered.length ? filtered : '';
  }

  //shared link event
  sharedLinkEvent(event: any) {
    if (event && event.eventType) {
      switch (event.eventType) {
        case "select":
          let checkUserExist = this.sharedLinkDetail.selectedUserList.find((item: any) => item.user_id === event.data.user_id);
          if (!checkUserExist) {
            this.sharedLinkDetail.selectedUserList.push(event.data);
          }
          break;
        case "unselect":
          this.sharedLinkDetail.selectedUserList = this.sharedLinkDetail.selectedUserList.filter((item: any) => item.user_id !== event.data.user_id);
          break;
        case "inviteType":
          this.sharedLinkDetail.iniviteType = event.data;
          break;
        case "chipremove":
          this.sharedLinkDetail.selectedUserList = this.sharedLinkDetail.selectedUserList.filter((item: any) => item.user_id !== event.data.user_id);
          this.sharedLinkDetail.removeUserChip = event.data;
          this.sharedLinkDetail.removeUserAccess = true;
          this.inviteRemoveUser();
          break;
        case "autocomplete":
          let data: any = { query: event.query, data: event.data };
          this.filteredReveiwer(data);
          break;
        default:
          break;
      }
    }
  }

}
