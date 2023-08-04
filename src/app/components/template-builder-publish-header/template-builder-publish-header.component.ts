import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/api/api.service';
import { environment } from 'src/environments/environment';
import { UserUtil } from '../../utils/user-util';
import { MenuItem } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from '../services/utils.service';
interface Product {
  name: string;
  value: string;
  url?: string;
}@Component({
  selector: 'xnode-template-builder-publish-header',
  templateUrl: './template-builder-publish-header.component.html',
  styleUrls: ['./template-builder-publish-header.component.scss'],
  providers: [ConfirmationService, MessageService]
})

export class TemplateBuilderPublishHeaderComponent implements OnInit {
  @Output() iconClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() loadSpinnerInParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() productId?: string | null;

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
  iframeSrc: any;
  emailData: any;

  constructor(private apiService: ApiService, private router: Router,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer,
    private utilsService: UtilsService
  ) {
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

    this.emailData = localStorage.getItem('currentUser');
    if (this.emailData) {
      let JsonData = JSON.parse(this.emailData)
      this.emailData = JsonData?.email;
    }
    if (localStorage.getItem('record_id')) {
      this.productId = this.productId ? this.productId : localStorage.getItem('record_id')
      let iframeSrc = environment.designStudioUrl + "?email=" + this.emailData + "&id=" + this.productId + "";
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(iframeSrc);

    }
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
      window.open(environment.designStudioUrl + "?email=" + this.emailData + "&id=" + this.productId + "");


    } else {
      this.showConfirmationPopup();
    }
  }
  showConfirmationPopup(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to publish this product?',
      header: 'Confirmation',
      accept: () => {
        console.log(this.productId)
        this.utilsService.loadSpinner(true)
        const body = {
          repoName: localStorage.getItem('app_name'),
          projectName: 'xnode',
          email: this.currentUser?.email,
          envName: environment.name,
          productId: this.productId ? this.productId : localStorage.getItem('record_id')
        }
        this.publishProduct(body);
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }

  publishProduct(body: any): void {
    let detail = "Your app publishing process started. You will get the notifications";
    this.apiService.publishApp(body)
      .then(response => {
        if (response) {
          this.loadSpinnerInParent.emit(false);
          this.utilsService.loadToaster({ severity: 'success', summary: '', detail: detail });
          this.utilsService.loadSpinner(false)
        }
      })
      .catch(error => {
        console.log('error', error);
        this.loadSpinnerInParent.emit(false);
        this.utilsService.loadToaster({ severity: 'error', summary: 'API Error', detail: 'An error occurred while publishing the product.' });
        this.utilsService.loadSpinner(false)
      });
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
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error });
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

