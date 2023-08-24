import { Component, HostListener, OnInit } from '@angular/core';
import { HeaderItems } from '../../constants/AppHeaderItems'
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { WebSocketService } from 'src/app/web-socket.service';
import { ApiService } from '../../api/api.service'
import { environment } from 'src/environments/environment';
import { RefreshListService } from '../../RefreshList.service'
import { UtilsService } from 'src/app/components/services/utils.service';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'xnode-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  providers: [MessageService, ConfirmationService],
})

export class AppHeaderComponent implements OnInit {
  headerItems: any;
  logoutDropdown: any;
  selectedValue: any;
  channel: any;
  email: string = '';
  id: string = '';
  activeFilter: string = '';
  filterTypes: any = {
    recent: false,
    important: false,
    pinned: false,
    all: true
  };
  allNotifications: any[] = [];
  notifications: any[] = [];
  notificationCount: any = 0;
  product_url: string = "https://dev-navi.azurewebsites.net/";
  username: string = ''
  visible: boolean = false;
  products: any[] = [];
  submitted: boolean  = false;
  isFormSubmitted: boolean  = false;
  brandguidelinesForm: any;
  isInvalid: boolean = false;
  isPlaceholderVisible: boolean  = false;
  draganddropSelected: boolean  = false;
  browserSelected!: boolean;
  feedbackForm: FormGroup;

  constructor(private RefreshListService: RefreshListService, private apiService: ApiService, private utilsService: UtilsService,
    private router: Router, private webSocketService: WebSocketService,
    private confirmationService: ConfirmationService,private fb: FormBuilder) {
      this.feedbackForm = this.fb.group({
        product: ['', Validators.required],
        component: ['', Validators.required],
        helpUsImprove: ['', Validators.required],
        logoFile: [null, Validators.required]
      });
  }
  get feedback() { return this.feedbackForm.controls; }
  ngOnInit(): void {
    let data = localStorage.getItem("currentUser")
    if (data) {
      let currentUser = JSON.parse(data);
      if (currentUser && currentUser.email == "admin@xnode.ai") {
        this.username = 'Mike Abbott'
      } else {
        this.username = 'Raymond Nelson'
      }
    }
    this.headerItems = HeaderItems;
    this.logoutDropdown = [
      {
        label: 'Logout',
        command: () => {
          localStorage.clear();
          this.router.navigate(['/']);
        }
      },
    ];
    this.initializeWebsocket();
    this.products = [
      { name: 'Select Product', code: 'select Product' },
      { name: 'Other', code: 'other' },
    ];
   
  }
  getFeedback() {
    this.submitted = true;
    this.isFormSubmitted = true;
      if (this.feedbackForm.valid) {
      this.isInvalid = false;
      const formValues = this.feedbackForm.value;
      console.log(formValues);
    }else{
      this.isInvalid = true;
      console.log("error");
     
    }
  }

  files: any[] = [];
  onFileDropped($event: any) {
    this.prepareFilesList($event);
    this.feedbackForm.patchValue({
      logoFile: $event[0]
    });
  }
  /**
    * handle file from browsing
    */
  fileBrowseHandler(files: any) {
    this.files = [];
    this.prepareFilesList(files);
    this.feedbackForm.patchValue({
      logoFile: files[0] // Update the value of the logoFile control
    });
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }
  /**
    * Simulate the upload process
    */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }
  /**
     * Convert Files list to normal array list
     * @param files (Files List)
     */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      if (this.files) {
        this.files.push(item);
      }
    }
    this.uploadFilesSimulator(0);
  }
  /**
     * format bytes
     * @param bytes (File size in bytes)
     * @param decimals (Decimals point)
     */
  formatBytes(bytes: any, decimals: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  
  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // Check if the Enter key was pressed
    if (event.key === 'Enter') {
      this.getFeedback();
    }
  }
  validateLogoFile(control: AbstractControl) {
    const file = control.value;
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        return { invalidType: true };
      }
      if (file.size > maxSize) {
        return { invalidSize: true };
      }
    }
    return null;
  }
  onInputFocus() {
    this.isPlaceholderVisible = false;
  }
  onInputBlur() {
    this.isPlaceholderVisible = false;
  }
  selectDraganddrop() {
    this.draganddropSelected = true;
    this.browserSelected = false;
  }
  selectBrowser() {
    this.draganddropSelected = false;
    this.browserSelected = true;
  }
  showDialog() {
    this.visible = true;
  }
  initializeWebsocket() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
    }
    this.webSocketService.emit('join', environment.webSocketNotifier);
    this.webSocketService.onEvent(this.email).subscribe((data: any) => {
      this.allNotifications.unshift(data);
      this.notifications = this.allNotifications;
      this.notificationCount = this.notifications.length
      if (data.product_status === 'completed') {
        this.RefreshListService.updateData('refreshproducts');
      }
      if (data.product_status === 'deployed') {
        const body = {
          product_id: data.product_id,
          product_url: data.product_url,
        }
        this.apiService.patch(body, '/update_product_url')
          .then(response => {
            if (!response) {
              this.utilsService.loadToaster({ severity: 'error', summary: '                                                                                                                       ' });
            }
          })
          .catch(error => {
            this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error });
          });
      }
    })
  }

  toggleAccordion() {
    this.notificationCount = 0;
  }

  showMePublishPopup(obj: any): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to publish this product?',
      header: 'Confirmation',
      accept: () => {
        this.publishApp(obj);
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }

  publishApp(obj: any): void {
    this.utilsService.loadSpinner(true)
    const body = {
      repoName: obj.product_name,
      projectName: 'xnode',
      email: this.email,
      envName: environment.branchName,
      productId: obj.product_id
    }
    this.apiService.publishApp(body)
      .then(response => {
        if (response) {
          this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'Your app publishing process started. You will get the notifications', life: 3000 });
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: 'Network Error', life: 3000 });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch(error => {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error, life: 3000 });
        this.utilsService.loadSpinner(false);
      });
  }
}
