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
  selectedOption = 'Preview';
  templates: any;
  selectedTemplate = localStorage.getItem('app_name');
  selectedDeviceIndex: string | null = null;
  templatesOptions: DropdownOption[] = [];
  templateEvent: any;
  showDeviceIcons: boolean = false;
  currentUser?: any;
  productOptions: MenuItem[];

  constructor(private apiService: ApiService, private router: Router, private messageService: MessageService) {
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
    this.templates = [
      { label: localStorage.getItem('app_name') }
    ]
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
    if (this.selectedOption == 'Preview') {
      window.open(environment.designStudioUrl, '_blank');
    } else if (this.selectedOption == 'Publish') {
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
}
