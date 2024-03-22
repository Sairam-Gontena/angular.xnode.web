import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { SpecificationsService } from 'src/app/services/specifications.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { SpecVersion } from 'src/models/spec-versions';
import { SpecificationUtilsService } from '../../diff-viewer/specificationUtils.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  invities = [
    { name: 'Invite only', code: 'Invite' },
    { name: 'Anyone with link at App’s Spec', code: 'Anyone' },
    { name: 'Everyone at FinBuddy workspace', code: 'Everyone' }
  ];
  selectedInvite: any;
  value: any;
  filteredReveiwers: any = [];
  references: any;
  userList: any;
  suggestions: any;
  selectedItem: any;
  addShareForm: FormGroup;
  // reviewersList: string | null;

  constructor(
    private utils: UtilsService,
    private specUtils: SpecUtilsService,
    private storageService: LocalStorageService,
    private specService: SpecificationsService,
    private SpecificationUtils: SpecificationUtilsService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
  ) {
    this.SpecificationUtils._openConversationPanel.subscribe((data: any) => {
      if (data) {
        this.conversationPanelInfo = data;
        this.product = this.storageService.getItem(StorageKeys.Product);
        this.selectedVersion = this.storageService.getItem(
          StorageKeys.SpecVersion
        );
      }
    });
    this.utils.getMeProductId.subscribe((data)=>{
      if(data){
        this.product = this.storageService.getItem(StorageKeys.Product);
      }
    })
    this.addShareForm = this.fb.group({
      reviewersLOne: [[], [Validators.required]],
      files: [[]],
    });
    this.references = [];

    this.addShareForm.value.reviewersLOne.forEach((item: any) => {
      this.references.push({
        entity_type: 'User',
        entity_id: item.user_id,
      });
    });
  }

  ngOnInit(): void {
    this.getStorageData();
    if (this.onDiffValue) {
      if (this.onDiffValue.onDiff) this.diffView = true;
      if (this.onDiffValue.viewType) this.viewType = this.onDiffValue.viewType;
    }
    this.userList = this.localStorageService.getItem(StorageKeys.USERLIST);
    this.userList.forEach((element: any) => {
      element.name = element.first_name + ' ' + element.last_name;
    });
    this.utils.openDockedNavi.subscribe((res:boolean) => {
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
    this.isMeneOpened.emit(true);
  }
  filteredReveiwer(event: AutoCompleteCompleteEvent, reviewerType: string) {
    let filtered: any[] = [];
    let query = event.query;
    const selectedReviewers = this.addShareForm.value.reviewersLOne.map(
      (reviewer: any) => reviewer.name.toLowerCase()
    );
    filtered = this.userList.filter(
      (reviewer: any) =>
        reviewer.name.toLowerCase().indexOf(query.toLowerCase()) === 0 &&
        !selectedReviewers.includes(reviewer.name.toLowerCase())
    );
    this.filteredReveiwers = filtered;
  }
  search(event: AutoCompleteCompleteEvent) {
    this.suggestions = [...Array(10).keys()].map(
      (item) => event.query + '-' + item
    );
  }

  reduceToInitials(fullName: string): string {
    const nameParts = fullName.split(' ');
    const initials = nameParts.map((part) => part.charAt(0));
    const reducedName = initials.join('').toUpperCase();
    return reducedName;
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
    this.utils.disableDockedNavi();
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
    this.utils.loadSpinner(true);
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
}
