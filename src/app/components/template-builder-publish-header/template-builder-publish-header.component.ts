import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/api/api.service';
import { environment } from 'src/environments/environment';
import { UserUtil } from '../../utils/user-util';
import { MenuItem } from 'primeng/api';
import { UtilsService } from '../services/utils.service';
interface Product {
  name: string;
  value: string;
  url?: string;
}@Component({
  selector: 'xnode-template-builder-publish-header',
  templateUrl: './template-builder-publish-header.component.html',
  styleUrls: ['./template-builder-publish-header.component.scss']
})

export class TemplateBuilderPublishHeaderComponent implements OnInit {
  @Output() iconClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() loadSpinnerInParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() productId?: string;
  selectedOption = 'Preview';
  selectedDeviceIndex: string | null = null;
  templateEvent: any;
  showDeviceIcons: boolean = false;
  currentUser?: any;
  productOptions: MenuItem[];

  templates: Product[] | undefined;
  selectedTemplate: Product | undefined;
  url: any;
  productData: any;
  toast = false;
  constructor(private apiService: ApiService, private router: Router, private messageService: MessageService, private UtilsService: UtilsService) {
    this.currentUser = UserUtil.getCurrentUser();
    this.productOptions = [
      {
        label: 'Preview',
        command: () => {
          this.onChangeOption('Preview');
        }
      },
      {
        label: 'Publish',
        command: () => {
          this.onChangeOption('Publish');
        }
      },
    ];
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/design') {
      this.showDeviceIcons = true;
    }
    this.getAllProducts()
    let name = localStorage.getItem('app_name')
    let value = localStorage.getItem('record_id')
    let url = localStorage.getItem('product_url');
    this.selectedTemplate = { name: name ? name : '', value: value ? value : '', url: url ? url : '' };
  };
  openExternalLink(productUrl: string | undefined) {
    window.open(productUrl, '_blank');
  }

  refreshCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  deviceIconClicked(icon: string) {
    if (this.selectedDeviceIndex === icon) {
      this.selectedDeviceIndex = null;
    } else {
      this.selectedDeviceIndex = icon;
    }
    this.iconClicked.emit(icon);
  }

  onChangeOption(event: string) {
    this.selectedOption = event;
    this.onSelectOption();
  }

  onSelectOption(): void {
    if (this.selectedOption == 'Preview') {
      window.open(environment.designStudioUrl, '_blank');
    } else if (this.selectedOption == 'PUBLISH') {
      ``
      this.UtilsService.startSpinnerInApp()
      const body = {
        repoName: localStorage.getItem('app_name'),
        projectName: 'xnode',
        email: this.currentUser?.email,
        envName: environment.name,
        productId: this.productId
      }
      let detail = "Your app publishing process started. You will get the notifications";
      this.apiService.publishApp(body)
        .then(response => {
          if (response) {

            this.UtilsService.endSpinnerInApp('success', '', detail);
          }
        })
        .catch(error => {
          console.log('error', error);
          this.UtilsService.endSpinnerInApp('success', '', detail);
        });
    } else {
      return;
    }
  }

  //get calls 
  getAllProducts(): void {
    this.apiService.get("/get_metadata/" + this.currentUser?.email)
      .then(response => {
        if (response?.status === 200 && response.data.data?.length) {
          const data = response.data.data.map((obj: any) => ({
            name: obj.title,
            value: obj.id,
            url: obj.product_url
          }));
          this.templates = data;
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  selectedProduct(data: any): void {
    localStorage.setItem('record_id', data.value.value);
    localStorage.setItem('app_name', data.value.name);
    localStorage.setItem('product_url', data.value.url ? data.value.url : '');

    this.selectedTemplate = { name: data.value.name, value: data.value.value };
    this.refreshCurrentRoute()
  }


}

