import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserUtil } from '../../utils/user-util';
import { MessageService } from 'primeng/api';
import { RefreshListService } from '../../RefreshList.service';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { AuthApiService } from 'src/app/api/auth.service';
import { cloneDeep, find, orderBy, sortBy } from 'lodash';
import { DropdownModule } from 'primeng/dropdown';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { NaviApiService } from 'src/app/api/navi-api.service';
import { ConversationApiService } from 'src/app/api/conversation-api.service';

@Component({
  selector: 'xnode-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss'],
  providers: [MessageService, DropdownModule],
})
export class MyProductsComponent implements OnInit {
  templateCard: any[] = [];
  currentUser?: any;
  private subscription: Subscription;
  isLoading: boolean = true;
  activeIndex: number = 0;
  searchText: any;
  filteredProducts: any[] = [];
  email: any;
  filteredProductsByEmail: any[] = [];
  showLimitReachedPopup: any;
  tabAllProducts = false;
  tabRecent = false;
  tabCreated = false;
  timeAgo: any;
  isTitleHovered: any;
  userImage: any;
  end = 3;
  filteredProductsLength = 0;
  activeIndexRecentActivity: number = 0;
  isViewLess = true;
  AllConversations: any[] = [];
  filteredConversation: any[] = [];
  mineConversations: any[] = [];
  Conversations: any = [
    { name: 'All', value: 'All' },
    { name: 'Mine', value: 'Mine' },
  ];
  selectedConversation: any = { name: 'All', value: 'All' };
  enableSearch: boolean = false;
  searchTextConversation: any;
  loading: boolean = false;

  constructor(
    private RefreshListService: RefreshListService,
    public router: Router,
    private route: ActivatedRoute,
    private utils: UtilsService,
    private authApiService: AuthApiService,
    private auditUtil: AuditutilsService,
    private storageService: LocalStorageService,
    private naviApiService: NaviApiService,
    private conversationApiService: ConversationApiService
  ) {
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    if (this.currentUser.first_name && this.currentUser.last_name) {
      this.userImage =
        this.currentUser.first_name.charAt(0).toUpperCase() +
        this.currentUser.last_name.charAt(0).toUpperCase();
    }
    this.subscription = this.RefreshListService.headerData$.subscribe(
      (data) => {
        if (data === 'refreshproducts') {
          this.getMetaData();
        }
      }
    );
    this.utils.startSpinner.subscribe((event: boolean) => {
      this.loading = event;
    });
  }

  ngOnInit(): void {
    this.utils.loadSpinner(true);
    this.route.queryParams.subscribe((params: any) => {
      if (params.product === 'created') {
        this.utils.loadToaster({
          severity: 'success',
          summary: 'SUCCESS',
          detail:
            'Started generating application, please look out for notifications in the top nav bar',
          life: 10000,
        });
      }
    });
    this.removeProductDetailsFromStorage();
    this.removeParamFromRoute();
    this.filterProductsByUserEmail();
    this.utils.prepareIframeUrl(true);
  }

  removeProductDetailsFromStorage(): void {
    localStorage.removeItem('record_id');
    localStorage.removeItem('has_insights');
    localStorage.removeItem('app_name');
    localStorage.removeItem('show-upload-panel');
    localStorage.removeItem('product_url');
    localStorage.removeItem('targetUrl');
    localStorage.removeItem('NOTIF_INFO');
    localStorage.removeItem('product_email');
    this.storageService.removeItem(StorageKeys.Product);
    this.storageService.removeItem(StorageKeys.SPEC_DATA);
    this.storageService.removeItem(StorageKeys.SpecVersion);
    this.storageService.removeItem(StorageKeys.SelectedSpec);
    this.getMetaData();
  }

  getMeMyAvatar(userAvatar?: any) {
    if (!userAvatar) {
      return '';
    }
    let parts = userAvatar.split(' ');
    const initials = parts
      .map((part: any) => {
        if (part == 'Created' || part == 'by') {
          return;
        } else if (part == 'you') {
          return (
            this.currentUser?.first_name.charAt(0).toUpperCase() +
            this.currentUser?.last_name.charAt(0).toUpperCase()
          );
        } else {
          return part[0].toUpperCase();
        }
      })
      .join('');
    return initials;
  }

  removeParamFromRoute(): void {
    this.router.navigate([], {
      queryParams: {
        product: null,
      },
      queryParamsHandling: 'merge',
    });
  }
  searchKey(data: string) {
    this.searchText = data;
    this.search();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClickProductCard(data: any): void {
    this.utils.disableDockedNavi();
    this.auditUtil.postAudit('ON_CLICK_PRODUCT', 1, 'SUCCESS', 'user-audit');
    if (this.currentUser?.email == data.email) {
      this.utils.hasProductPermission(true);
    } else {
      this.utils.hasProductPermission(false);
    }
    delete data.created_by;
    delete data.timeAgo;
    this.storageService.saveItem(StorageKeys.Product, data);
    localStorage.setItem('record_id', data.id);
    localStorage.setItem('app_name', data.title);
    localStorage.setItem('has_insights', data.has_insights);
    if (!data.has_insights) {
      this.router.navigate(['/x-pilot']);
    } else {
      this.router.navigate(['/specification']);
    }
    this.utils.productContext(true);
  }

  onClickNew() {
    console.log('onClickNew');
    this.utils.expandNavi$();
    // this.router.navigate(['/x-pilot']);
    // this.auditUtil.postAudit('NEW_PRODUCT_CREATE', 1, 'SUCCESS', 'user-audit');
  }

  openExternalLink(productUrl: string) {
    window.open(productUrl, '_blank');
  }
  importNavi() {
    const restrictionMaxValue = localStorage.getItem('restriction_max_value');
    let totalApps = localStorage.getItem('meta_data');
    if (totalApps) {
      let data = JSON.parse(totalApps);
      let filteredApps = data.filter(
        (product: any) => product.email == this.currentUser.email
      );
      if (
        restrictionMaxValue &&
        filteredApps.length >= parseInt(restrictionMaxValue)
      ) {
        this.utils.showLimitReachedPopup(true);
        localStorage.setItem('show-upload-panel', 'false');
      } else {
        this.router.navigate(['/x-pilot']);
        localStorage.setItem('show-upload-panel', 'true');
        this.auditUtil.postAudit('CSV_IMPORT', 1, 'SUCCESS', 'user-audit');
      }
    }
  }

  getMetaData() {
    this.naviApiService
      .getMetaData(this.currentUser?.email)
      .then((response: any) => {
        if (response?.status === 200 && response.data.data?.length) {
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_METADATA_MY_PRODUCTS',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            ''
          );
          this.storageService.saveItem(
            StorageKeys.MetaData,
            response.data.data
          );
          this.templateCard = response.data.data.map((dataItem: any) => {
            dataItem.timeAgo = this.utils.calculateTimeAgo(dataItem.created_on);
            if (this.currentUser.user_id === dataItem?.user_id)
              dataItem.created_by = 'Created by you';
            else dataItem.created_by = 'Created by ' + dataItem?.username;
            return dataItem;
          });

          this.filteredProducts = sortBy(this.templateCard, [
            'created_on',
          ]).reverse();
          this.filteredProductsLength = this.filteredProducts.length
            ? this.filteredProducts.length + 1
            : 0;
          this.filteredProductsByEmail = this.templateCard;
          this.utils.loadSpinner(false);
          // this.getAllConversations();
        } else if (response?.status !== 200) {
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_METADATA_MY_PRODUCTS',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            ''
          );
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response?.data?.detail,
          });
          this.utils.loadSpinner(false);
        }
      })
      .catch((error: any) => {
        let user_audit_body = {
          method: 'GET',
          url: error?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_METADATA_MY_PRODUCTS',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser.email,
          ''
        );
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      });
  }

  onClickcreatedByYou(): void {
    this.filteredProducts = sortBy(
      this.filteredProducts.filter((obj) => {
        return obj?.user_id === this.currentUser.user_id;
      }),
      ['created_on']
    ).reverse();
    this.filteredProductsLength = this.filteredProducts.length
      ? this.filteredProducts.length + 1
      : 0;
    this.filteredProducts = this.filteredProducts.filter((obj) => {
      return obj?.user_id === this.currentUser.user_id;
    });
    this.filteredProducts = cloneDeep(this.filteredProducts);
    this.end = 3;
    this.isViewLess = true;
  }

  onClickAllProducts(): void {
    this.filteredProducts = sortBy(
      [...this.templateCard],
      ['created_on']
    ).reverse();
    this.filteredProductsLength = this.filteredProducts.length
      ? this.filteredProducts.length + 1
      : 0;
    this.filteredProducts = cloneDeep(this.filteredProducts);
    this.end = 3;
    this.isViewLess = true;
  }

  search() {
    this.filteredProducts =
      this.searchText === ''
        ? this.templateCard
        : this.templateCard.filter((element) => {
            return element.title
              ?.toLowerCase()
              .includes(this.searchText.toLowerCase());
          });
  }

  searchConversation() {
    this.filteredConversation =
      this.searchTextConversation === ''
        ? this.AllConversations
        : this.AllConversations.filter((element) => {
            return element.title
              ?.toLowerCase()
              .includes(this.searchTextConversation.toLowerCase());
          });
  }

  toggleSearch() {
    if (this.enableSearch) {
      this.enableSearch = false;
    } else {
      this.enableSearch = true;
    }
  }

  filterProductsByUserEmail() {
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.filteredProductsByEmail = this.templateCard.filter(
      (product) => product.email === this.currentUser.email
    );
    this.getMeCreateAppLimit();
  }

  onClickNewWithNavi(): void {
    this.utils.expandNavi$();
  }

  getMeCreateAppLimit(): void {
    this.authApiService
      .get('/user/get_create_app_limit/' + this.currentUser.email)
      .then((response: any) => {
        if (response?.status === 200) {
          localStorage.setItem(
            'restriction_max_value',
            response.data[0].restriction_max_value
          );
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_METADATA_MY_PRODUCTS',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            ''
          );
        } else {
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_METADATA_MY_PRODUCTS',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            ''
          );
          this.utils.loadToaster({
            severity: 'error',
            summary: '',
            detail: response.data?.detail,
          });
        }
      })
      .catch((error: any) => {
        let user_audit_body = {
          method: 'GET',
          url: error?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_METADATA_MY_PRODUCTS',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser.email,
          ''
        );
        this.utils.loadToaster({
          severity: 'error',
          summary: '',
          detail: error,
        });
        this.utils.loadSpinner(true);
      });
  }

  onViewAll() {
    this.isViewLess = false;
    this.end = this.filteredProductsLength;
  }

  onViewLess() {
    this.isViewLess = true;
    this.end = 3;
  }

  getAllConversations() {
    this.conversationApiService
      .getAllConversations()
      .then((response: any) => {
        if (response) {
          this.AllConversations = this.mapProductNameToConversations(
            response.data
          );
          this.filteredConversation = this.AllConversations;
          this.getMeConversationsByContributers();
        } else {
          this.utils.loadSpinner(false);
        }
      })
      .catch((err: any) => {
        this.utils.loadSpinner(false);
      });
  }

  getMeConversationsByContributers(): void {
    this.conversationApiService
      .getConversationsByContributor(this.currentUser?.user_id)
      .then((response: any) => {
        if (response && response.status == 200 && response.data) {
          this.mineConversations = this.mapProductNameToConversations(
            response.data
          );
        }
        this.utils.loadSpinner(false);
      })
      .catch((error: any) => {
        console.log(error);
        this.utils.loadSpinner(false);
      });
  }

  mapProductNameToConversations(_conversations: any) {
    _conversations.forEach((conversation: any, i: any) => {
      let product = find(this.filteredProducts, { id: conversation.productId });
      _conversations[i]['productName'] =
        product && product.title ? product.title : '';
    });
    return orderBy(_conversations, ['modifiedOn']);
  }
}
