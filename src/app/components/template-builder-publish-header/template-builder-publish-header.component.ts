import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/api/api.service';
import { environment } from 'src/environments/environment';
import { UserUtil } from '../../utils/user-util';
import { MenuItem } from 'primeng/api';
interface DropdownOption {
  label: string;
  value: string;
}
interface Product {
  name: string;
  value: string;
}
@Component({
  selector: 'xnode-template-builder-publish-header',
  templateUrl: './template-builder-publish-header.component.html',
  styleUrls: ['./template-builder-publish-header.component.scss'],
  providers: [ConfirmationService, MessageService]
})

export class TemplateBuilderPublishHeaderComponent implements OnInit {
  @Output() iconClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() loadSpinnerInParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() productId?: string;
  selectedOption = 'Preview';
  selectedDeviceIndex: string | null = null;
  templatesOptions: DropdownOption[] = [];
  templateEvent: any;
  showDeviceIcons: boolean = false;
  currentUser?: any;
  productOptions: MenuItem[];

  templates: Product[] | undefined;
  selectedTemplate: Product | undefined


  constructor(private apiService: ApiService, private router: Router, private messageService: MessageService,
    private confirmationService: ConfirmationService
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
    this.selectedTemplate = { name: name ? name : '', value: value ? value : '' };
  };

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
    } else if (this.selectedOption == 'Publish') {

      this.confirmationService.confirm({
        message: 'Are you sure you want to publish this product?',
        //icon: 'pi pi-exclamation-triangle',

        accept: () => {
          console.log('yes');

          this.loadSpinnerInParent.emit(true);
          const body = {
            repoName: localStorage.getItem('app_name'),
            projectName: 'xnode',
            email: this.currentUser?.email,
            envName: environment.name,
            productId: this.productId
          }
          this.apiService.publishApp(body)
            .then(response => {
              if (response) {
                this.loadSpinnerInParent.emit(false);
              }
            })
            .catch(error => {
              console.log('error', error);
              this.loadSpinnerInParent.emit(false);
              //  this.messageService.add({ severity: 'error', summary: 'API Error', detail: 'An error occurred while publishing the product.' });
            });
        },
        reject: () => {
          this.confirmationService.close();
        }
      });

    }
    else {
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
            value: obj.id
          }));
          this.templates = data;
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  selectedProduct(data: any): void {
    const app_name = this.templates?.filter((item: any) => item.value === data.value.value)[0].name
    localStorage.setItem('record_id', data.value.value);
    localStorage.setItem('app_name', app_name ? app_name : '');
    this.selectedTemplate = { name: app_name ? app_name : '', value: data.value.value };
    this.refreshCurrentRoute()
  }
}
