import { Component, OnInit, HostListener, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'xnode-template-builder-publish-header',
  templateUrl: './template-builder-publish-header.component.html',
  styleUrls: ['./template-builder-publish-header.component.scss']
})

export class TemplateBuilderPublishHeaderComponent implements OnInit {
  @Output() iconClicked: EventEmitter<string> = new EventEmitter<string>();

  selectedOption: string = 'Preview';
  templates: any;
  selectedTemplate = localStorage.getItem('app_name');
  selectedDeviceIndex: string | null = null;
  templatesOptions: any;
  templateEvent: any;
  showDeviceIcons: boolean = false;
  constructor(private apiService: ApiService, private router: Router) {

  }
  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/design') {
      this.showDeviceIcons = true;
    }
    this.templates = [
      { label: localStorage.getItem('app_name') }
    ]

    this.templatesOptions = [
      {
        label: 'Preview',
        command: () => {
          this.selectedOption = 'Preview';
        }
      },
      {
        label: 'Publish',
        command: () => {
          this.selectedOption = 'Publish';
        }
      },
    ];
  };
  emitIconClicked(icon: string) {
    if (this.selectedDeviceIndex === icon) {
      this.selectedDeviceIndex = null;
    } else {
      this.selectedDeviceIndex = icon;
    }
    this.iconClicked.emit(icon);
  }

  onSelectOption(): void {
    if (this.selectedOption == 'Preview') {
      window.open(environment.designStudioUrl, '_blank');
    } else {
      this.apiService.publishApp({ name: localStorage.getItem('app_name') })
        .then(response => {
          console.log('response', response);
        })
        .catch(error => {
          console.log('error', error);
        });
    }
  }
}
