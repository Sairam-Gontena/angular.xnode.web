import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { UserUtil } from '../../utils/user-util';
import { MessageService } from 'primeng/api';
import { RefreshListService } from '../../RefreshList.service'
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service'
@Component({
  selector: 'xnode-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss'],
  providers: [MessageService]
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

  constructor(private RefreshListService: RefreshListService,
    public router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private utils: UtilsService,
    private auditUtil: AuditutilsService) {
    this.currentUser = UserUtil.getCurrentUser();
    this.subscription = this.RefreshListService.headerData$.subscribe((data) => {
      if (data === 'refreshproducts') {
        this.getMetaData()
      }
    });
  }

  ngOnInit(): void {
    this.utils.loadSpinner(true);
    localStorage.removeItem('record_id');
    localStorage.removeItem('app_name');
    localStorage.removeItem('show-upload-panel');
    localStorage.removeItem('product');
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

  getMeTotalOnboardedApps(user: any): void {
    this.apiService.get("/total_apps_onboarded/" + user?.email)
      .then((response: any) => {
        if (response?.status === 200) {
          localStorage.setItem('total_apps_onboarded', response.data.total_apps_onboarded);
        } else {
          this.utils.loadToaster({ severity: 'error', summary: '', detail: response.data?.detail });
        }
      })
      .catch((error: any) => {
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

  onClickCreateNewTemplate(data: any): void {
    localStorage.setItem('record_id', data.id);
    localStorage.setItem('product', JSON.stringify(data));
    localStorage.setItem('app_name', data.title);
    localStorage.setItem('has_insights', data.has_insights);
    this.router.navigate(['/dashboard']);
    this.auditUtil.post('PRODUCT_OPENED', 1, 'SUCCESS', 'user-audit');
  }

  onClickgotoxPilot() {
    this.router.navigate(['/x-pilot']);
    this.auditUtil.post('NEW_PRODUCT_CREATE', 1, 'SUCCESS', 'user-audit');
  }

  openExternalLink(productUrl: string) {
    window.open(productUrl, '_blank');
  }

  importNavi() {
    const restriction_max_value = localStorage.getItem('restriction_max_value');
    const total_apps_onboarded = localStorage.getItem('total_apps_onboarded');
    if (restriction_max_value && total_apps_onboarded && (JSON.parse(total_apps_onboarded) >= JSON.parse(restriction_max_value))) {
      this.utils.showLimitReachedPopup(true);
      return
    }
    this.router.navigate(['/x-pilot'])
    localStorage.setItem('show-upload-panel', 'true');
    this.auditUtil.post('CSV_IMPORT', 1, 'SUCCESS', 'user-audit');
  }

  getMetaData() {
    this.apiService.get("/get_metadata/" + this.currentUser?.email)
      .then(response => {
        if (response?.status === 200 && response.data.data?.length) {
          this.id = response.data.data[0].id;
          this.templateCard = response.data.data;
          this.filteredProducts = this.templateCard;
          this.filteredProductsByEmail = this.templateCard;
          localStorage.setItem('meta_data', JSON.stringify(response.data.data))
        } else if (response?.status !== 200) {
          this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.detail });
        }
        this.utils.loadSpinner(false);
      })
      .catch(error => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: error });

      });
  }

  search() {
    this.filteredProducts = this.searchText === ""
      ? this.templateCard
      : this.templateCard.filter((element) => {
        return element.title?.toLowerCase().includes(this.searchText.toLowerCase());
      });
  }

  filterProductsByUserEmail() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
    }
    this.filteredProductsByEmail = this.templateCard.filter((product) => product.email === this.email);
  }

  onClickNewWithNavi(): void {
    this.router.navigate(['/x-pilot']);
    this.auditUtil.post('NEW_WITH_NAVI', 1, 'SUCCESS', 'user-audit');
  }
}
