import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private RefreshListService: RefreshListService, public router: Router, private apiService: ApiService, private messageService: MessageService, private utilService: UtilsService) {
    this.currentUser = UserUtil.getCurrentUser();
    this.subscription = this.RefreshListService.headerData$.subscribe((data) => {
      if (data === 'refreshproducts') {
        this.getMeUserId()
      }
    });

  }

  ngOnInit(): void {
    this.utilService.loadSpinner(true);
    localStorage.removeItem('record_id');
    localStorage.removeItem('app_name')
    this.getMeUserId();

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClickCreateNewTemplate(data: any): void {
    localStorage.setItem('record_id', data.id);
    localStorage.setItem('app_name', data.title);
    this.router.navigate(['/design']);
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
        }
        this.utilService.loadSpinner(false);
      })
      .catch(error => {
        this.utilService.loadSpinner(false);
        this.utilService.loadToaster({ severity: 'error', summary: 'Error', detail: error });

      });
  }

}
