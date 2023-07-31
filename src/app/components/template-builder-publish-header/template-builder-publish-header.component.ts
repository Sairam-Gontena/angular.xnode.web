import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/api/api.service';
import { environment } from 'src/environments/environment';
import { UserUtil } from '../../utils/user-util';
import { MenuItem } from 'primeng/api';
interface DropdownOption {
  label: string;
  value: string;
}
@Component({
  selector: 'xnode-template-builder-publish-header',
  templateUrl: './template-builder-publish-header.component.html',
  styleUrls: ['./template-builder-publish-header.component.scss']
})

export class TemplateBuilderPublishHeaderComponent implements OnInit {
  @Output() iconClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() loadSpinnerInParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() productId?: string;
  selectedOption = 'PREVIEW';
  selectedProductName = {};
  templates: any;
  selectedTemplate = null
  selectedDeviceIndex: string | null = null;
  templatesOptions: DropdownOption[] = [];
  templateEvent: any;
  showDeviceIcons: boolean = false;
  currentUser?: any;
  options: any[] = [{ "name": "preview" }, { "name": "published" }];
  selectedDropDownOption: string = 'Preview'
  productOptions: MenuItem[];
  constructor(private apiService: ApiService, private router: Router, private messageService: MessageService) {
    this.currentUser = UserUtil.getCurrentUser();
    this.productOptions = [
      {
        label: 'Preview',
        icon: 'pi pi-refresh',
        command: () => {
          this.onChangeOption('PREVIEW');
        }
      },
      {
        label: 'Publish',
        icon: 'pi pi-times',
        command: () => {
          this.onChangeOption('PUBLISH');
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
  };

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
    if (this.selectedOption == 'PREVIEW') {
      window.open(environment.designStudioUrl, '_blank');
    } else if (this.selectedOption == 'PUBLISH') {
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
          console.log('response', response);
          if (response) {
            this.messageService.add({ severity: 'success', summary: '', detail: 'Your app publishing process started. You will get the notifications', sticky: true });
            this.loadSpinnerInParent.emit(false);
          }
        })
        .catch(error => {
          console.log('error', error);
          this.messageService.add({ severity: 'error', summary: '', detail: error, sticky: true });
          this.loadSpinnerInParent.emit(false);
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
            label: obj.title,
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
    const app_name = this.templates.filter((item: any) => item.value === data.value)[0].label
    localStorage.setItem('record_id', data.value);
    localStorage.setItem('app_name', app_name);
    this.router.navigate(['/design']);
  }
}
