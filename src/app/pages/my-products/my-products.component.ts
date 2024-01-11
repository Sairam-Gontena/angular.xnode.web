import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { UserUtil } from '../../utils/user-util';
import { MessageService } from 'primeng/api';
import { RefreshListService } from '../../RefreshList.service'
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service'
import { AuthApiService } from 'src/app/api/auth.service';
import { find, orderBy, sortBy } from 'lodash';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'xnode-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss'],
  providers: [MessageService, DropdownModule]
})

export class MyProductsComponent implements OnInit {
  id: String = '';
  templateCard: any[] = [];
  currentUser?: any;
  private subscription: Subscription;
  isLoading: boolean = true;
  activeIndex: number = 0;
  searchText: any;
  filteredProducts: any[] = []
  email: any;
  filteredProductsByEmail: any[] = [];
  showLimitReachedPopup: any;
  tabAllProducts = false;
  tabRecent = false;
  tabCreated = false;
  timeAgo: any;
  isTitleHovered: any;
  userImage: any;
  end = 2;
  filteredProductsLength = 0;
  activeIndexRecentActivity: number = 0;
  isViewLess = true;
  AllConversations: any[] = [];
  filteredConversation: any[] = [];
  mineConversations: any[] = [];
  Conversations: any = [
    { name: 'All', value: 'All' },
    { name: 'Mine', value: 'Mine' }
  ];
  selectedConversation: any = { name: 'All', value: 'All' };
  enableSearch: boolean =false;
  searchTextConversation:any;

  constructor(private RefreshListService: RefreshListService,
    public router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private utils: UtilsService,
    private authApiService: AuthApiService,
    private auditUtil: AuditutilsService,
  ) {
    this.currentUser = UserUtil.getCurrentUser();

    if (this.currentUser.first_name && this.currentUser.last_name) {
      this.userImage = this.currentUser.first_name.charAt(0).toUpperCase() + this.currentUser.last_name.charAt(0).toUpperCase();
    }
    this.subscription = this.RefreshListService.headerData$.subscribe((data) => {
      if (data === 'refreshproducts') {
        this.getMetaData()
      }
    });
  }

  ngOnInit(): void {
    this.utils.loadSpinner(true);
    localStorage.removeItem('record_id');
    localStorage.removeItem('has_insights');
    localStorage.removeItem('app_name');
    localStorage.removeItem('show-upload-panel');
    localStorage.removeItem('product');
    localStorage.removeItem('product_url');
    this.getMetaData();
    this.route.queryParams.subscribe((params: any) => {
      if (params.product === 'created') {
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: "Started generating application, please look out for notifications in the top nav bar", life: 10000 });
      }
    });
    setTimeout(() => {
      this.removeParamFromRoute()
    }, 2000);
    this.filterProductsByUserEmail();
  }

  getMeMyAvatar(userAvatar?: any) {
    let parts = userAvatar.split(' ');
    const initials = parts.map((part: any) => {
      if (part == 'Created' || part == 'by') {
        return;
      } else if (part == 'you') {
        return this.currentUser?.first_name.charAt(0).toUpperCase() + this.currentUser?.last_name.charAt(0).toUpperCase()
      } else {
        return part[0].toUpperCase()
      }
    }).join('');
    return initials;
  }

  getMeTotalOnboardedApps(user: any): void {
    this.apiService.get("navi/total_apps_onboarded/" + user?.email).then((response: any) => {
      if (response?.status === 200) {
        localStorage.setItem('total_apps_onboarded', response.data.total_apps_onboarded);
        let user_audit_body = {
          'method': 'GET',
          'url': response?.request?.responseURL,
        }
        this.auditUtil.postAudit('GET_TOTAL_ONBOARDED_APPS_MY_PRODUCTS', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.id);
      } else {
        let user_audit_body = {
          'method': 'GET',
          'url': response?.request?.responseURL,
        }
        this.auditUtil.postAudit('GET_TOTAL_ONBOARDED_APPS_MY_PRODUCTS', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.id);
        this.utils.loadToaster({ severity: 'error', summary: '', detail: response.data?.detail });
      }
    }).catch((error: any) => {
      let user_audit_body = {
        'method': 'GET',
        'url': error?.request?.responseURL,
      }
      this.auditUtil.postAudit('GET_TOTAL_ONBOARDED_APPS_MY_PRODUCTS', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.id);
      this.utils.loadToaster({ severity: 'error', summary: '', detail: error });
      this.utils.loadSpinner(true);
    });
  }

  removeParamFromRoute(): void {
    this.router.navigate([], {
      queryParams: {
        'product': null
      },
      queryParamsHandling: 'merge'
    })
  }
  searchKey(data: string) {
    this.searchText = data;
    this.search();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClickProductCard(data: any): void {
    this.auditUtil.postAudit('ON_CLICK_PRODUCT', 1, 'SUCCESS', 'user-audit');
    if (this.currentUser?.email == data.email) {
      this.utils.hasProductPermission(true)
    } else {
      this.utils.hasProductPermission(false)
    }
    localStorage.setItem('record_id', data.id);
    localStorage.setItem('product', JSON.stringify(data));
    localStorage.setItem('app_name', data.title);
    localStorage.setItem('has_insights', data.has_insights);
    if (!data.has_insights) {
      this.router.navigate(['/x-pilot']);
    } else {
      this.router.navigate(['/specification']);
    }
    this.utils.disableDockedNavi();
  }

  onClickgotoxPilot() {
    this.router.navigate(['/x-pilot']);
    this.auditUtil.postAudit('NEW_PRODUCT_CREATE', 1, 'SUCCESS', 'user-audit');
  }

  openExternalLink(productUrl: string) {
    window.open(productUrl, '_blank');
  }
  importNavi() {
    const restrictionMaxValue = localStorage.getItem('restriction_max_value');
    let totalApps = localStorage.getItem('meta_data');
    if (totalApps) {
      let data = JSON.parse(totalApps);
      let filteredApps = data.filter((product: any) => product.email == this.currentUser.email)
      if (restrictionMaxValue && filteredApps.length >= parseInt(restrictionMaxValue)) {
        this.utils.showLimitReachedPopup(true);
        localStorage.setItem('show-upload-panel', 'false');
      } else {
        this.router.navigate(['/x-pilot'])
        localStorage.setItem('show-upload-panel', 'true');
        this.auditUtil.postAudit('CSV_IMPORT', 1, 'SUCCESS', 'user-audit');
      }
    }
  }

  getMetaData() {
    this.apiService.get("navi/get_metadata/" + this.currentUser?.email)
      .then(response => {
        if (response?.status === 200 && response.data.data?.length) {
          this.id = response.data.data[0].id;
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL,
          }
          this.auditUtil.postAudit('GET_METADATA_MY_PRODUCTS', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.id);
          this.templateCard = response.data.data.map((dataItem: any) => {
            dataItem.timeAgo = this.utils.calculateTimeAgo(dataItem.created_on);
            if (this.currentUser.user_id === dataItem?.user_id)
              dataItem.created_by = 'Created by you';
            else
              dataItem.created_by = 'Created by ' + dataItem?.username;
            return dataItem;
          });

          this.filteredProducts = sortBy(this.templateCard, ['created_on']).reverse();
          this.filteredProductsLength = this.filteredProducts.length ? this.filteredProducts.length + 1 : 0;
          this.filteredProductsByEmail = this.templateCard;
          localStorage.setItem('meta_data', JSON.stringify(response.data.data))
        } else if (response?.status !== 200) {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL,
          }
          this.auditUtil.postAudit('GET_METADATA_MY_PRODUCTS', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.id);
          this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.detail });
        }
        this.getAllConversations();
        this.utils.loadSpinner(false);
      })
      .catch(error => {
        let user_audit_body = {
          'method': 'GET',
          'url': error?.request?.responseURL,
        }
        this.auditUtil.postAudit('GET_METADATA_MY_PRODUCTS', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.id);
        this.utils.loadSpinner(false);
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: error });
      });
  }

  onClickcreatedByYou(): void {
    this.filteredProducts = sortBy(this.filteredProducts.filter(obj => { return obj?.user_id === this.currentUser.user_id }), ['created_on']).reverse();
    this.filteredProductsLength = this.filteredProducts.length ? this.filteredProducts.length + 1 : 0;
  }

  onClickAllProducts(): void {
    this.filteredProducts = sortBy([...this.templateCard], ['created_on']).reverse();
    this.filteredProductsLength = this.filteredProducts.length ? this.filteredProducts.length + 1 : 0;
  }

  search() {
    this.filteredProducts = this.searchText === ""
      ? this.templateCard
      : this.templateCard.filter((element) => {
        return element.title?.toLowerCase().includes(this.searchText.toLowerCase());
      });
  }

  searchConversation() {
    this.filteredConversation = this.searchTextConversation === ""
      ? this.AllConversations
      : this.AllConversations.filter((element) => {
        return element.title?.toLowerCase().includes(this.searchTextConversation.toLowerCase());
      });
  }

  toggleSearch(){
    if(this.enableSearch){
      this.enableSearch = false;
    }else{
    this.enableSearch = true;
    }
  }

  filterProductsByUserEmail() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
    }
    this.filteredProductsByEmail = this.templateCard.filter((product) => product.email === this.email);
    this.getMeCreateAppLimit();
  }

  onClickNewWithNavi(): void {
    this.router.navigate(['/x-pilot']);
    this.auditUtil.postAudit('NEW_WITH_NAVI', 1, 'SUCCESS', 'user-audit');
  }

  getMeCreateAppLimit(): void {
    this.authApiService.get("/user/get_create_app_limit/" + this.email)
      .then((response: any) => {
        if (response?.status === 200) {
          localStorage.setItem('restriction_max_value', response.data[0].restriction_max_value);
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL,
          }
          this.auditUtil.postAudit('GET_METADATA_MY_PRODUCTS', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.id);
        } else {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL,
          }
          this.auditUtil.postAudit('GET_METADATA_MY_PRODUCTS', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.id);
          this.utils.loadToaster({ severity: 'error', summary: '', detail: response.data?.detail });
        }
      }).catch((error: any) => {
        let user_audit_body = {
          'method': 'GET',
          'url': error?.request?.responseURL,
        }
        this.auditUtil.postAudit('GET_METADATA_MY_PRODUCTS', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.id);
        this.utils.loadToaster({ severity: 'error', summary: '', detail: error });
        this.utils.loadSpinner(true);
      });
  }

  onViewAll() {
    this.isViewLess = false;
    this.end = this.filteredProductsLength;
  }

  onViewLess() {
    this.isViewLess = true;
    this.end = 2;
  }

  getAllConversations() {
    this.apiService.getAllConversations('conversation')
      .then((response) => {
        this.AllConversations = this.mapProductNameToConversations(response.data);
        this.filteredConversation = this.AllConversations;
      })
    if (this.currentUser && this.currentUser.user_id) {

      this.apiService.getConversationsByContributor('conversation/conversations-by-contributor?contributors=' + this.currentUser?.user_id)
        .then((response) => {
          if (response && response.status == 200 && response.data) {
            this.mineConversations = this.mapProductNameToConversations(response.data);
          }
        })
        .catch((error: any) => {
          console.log(error);
        })
    }
  }

  mapProductNameToConversations(_conversations: any) {
    _conversations.forEach((conversation: any, i: any) => {
      let product = find(this.filteredProducts, { id: conversation.productId });
      _conversations[i]['productName'] = product && product.title ? product.title : '';
    });
    return orderBy(_conversations, ['modifiedOn']);
  }

}
