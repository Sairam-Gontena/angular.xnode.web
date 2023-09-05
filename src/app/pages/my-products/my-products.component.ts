import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { UserUtil, User } from '../../utils/user-util';
import { MessageService } from 'primeng/api';
import { RefreshListService } from '../../RefreshList.service'
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/components/services/utils.service';
@Component({
  selector: 'xnode-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss'],
  providers: [MessageService]
})

export class MyProductsComponent implements OnInit {
  id: String = '';
  templateCard: any[] = [];
  currentUser?: User;
  private subscription: Subscription;
  isLoading: boolean = true;
  activeIndex: number = 0;
  searchText: any;
  filteredProducts: any[] = []

  constructor(private RefreshListService: RefreshListService, public router: Router, private apiService: ApiService,
    private route: ActivatedRoute, private utils: UtilsService) {
    this.currentUser = UserUtil.getCurrentUser();
    this.subscription = this.RefreshListService.headerData$.subscribe((data) => {
      if (data === 'refreshproducts') {
        this.getMeUserId()
      }
    });
  }

  ngOnInit(): void {
    this.utils.loadSpinner(true);
    localStorage.removeItem('record_id');
    localStorage.removeItem('app_name');
    this.getMeUserId();
    this.route.queryParams.subscribe((params: any) => {
      if (params.product === 'created') {
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: "Started generating application, please look out for notifications in the top nav bar", life: 10000 });
      }
    });
    setTimeout(() => {
      this.removeParamFromRoute()
    }, 2000);
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
    this.router.navigate(['/dashboard']);
  }
  onClickgotoxPilot() {
    this.router.navigate(['/x-pilot']);
  }
  openExternalLink(productUrl: string) {
    window.open(productUrl, '_blank');

  }

  //get calls 
  getMeUserId() {
    this.apiService.get("/get_metadata/" + this.currentUser?.email)
      .then(response => {
        if (response?.status === 200 && response.data.data?.length) {
          this.id = response.data.data[0].id;
          this.templateCard = response.data.data;
          this.filteredProducts = this.templateCard;
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

}
