import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserUtilsService } from 'src/app/api/user-utils.service';
import { User, UserUtil } from 'src/app/utils/user-util';
import { UtilsService } from '../services/utils.service';
import { CommonApiService } from 'src/app/api/common-api.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { FileService } from 'src/app/file.service';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'xnode-report-bug',
  templateUrl: './report-bug.component.html',
  styleUrls: ['./report-bug.component.scss'],
})
export class ReportBugComponent implements OnInit {
  @ViewChild('fileInput') fileInput?: ElementRef;
  @Input() visible = false;
  @Input() screenshot: any;
  @Output() dataActionEvent = new EventEmitter<any>();
  @Output() backEvent = new EventEmitter<boolean>();
  @Input() thanksDialog = false;
  @Input() templates: any[] = [];
  uploadedFile: any = [];
  public getScreenWidth: any;
  public dialogWidth: string = '40vw';
  modalPosition: any;
  currentUser?: any;
  submitted: boolean = false;
  bugReportForm: FormGroup;
  priorities: any[] = [];
  products: any[] = [];
  selectedProduct: any;
  selectedProductId: any;
  isFormSubmitted: boolean = false;
  brandguidelinesForm: any;
  isInvalid: boolean = false;
  isPlaceholderVisible: boolean = false;
  draganddropSelected: boolean = false;
  browserSelected: boolean = true;
  files: any[] = [];
  imageUrl: any;
  images: any = [];
  uploadedFileData: any = [];
  screenshotName: any[] = []; //= 'Image';
  @HostListener('window:resize', ['$event'])
  email: any;
  productId: any;
  bugReportFiles: any = [];
  priorityResponse: any;
  bugSeverityData: any;

  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 780) {
      this.modalPosition = 'bottom';
      this.dialogWidth = '100vw';
    } else if (this.getScreenWidth > 780 && this.getScreenWidth < 980) {
      this.modalPosition = 'center';
      this.dialogWidth = '75vw';
    } else if (this.getScreenWidth > 980) {
      this.modalPosition = 'center';
      this.dialogWidth = '40vw';
    }
  }

  constructor(
    private fb: FormBuilder,
    private userUtilsApi: UserUtilsService,
    public utils: UtilsService,
    private commonApi: CommonApiService,
    private auditUtil: AuditutilsService,
    private fileService: FileService,
    private router: Router
  ) {
    this.currentUser = UserUtil.getCurrentUser();
    this.onWindowResize();
    this.bugReportForm = this.fb.group({
      product: [localStorage.getItem('app_name'), Validators.required],
      section: [this.getMeComponent(), Validators.required],
      severityId: ['', Validators.required],
      feedbackText: ['', Validators.required],
      screenshot: [null],
    });
    let user = localStorage.getItem('currentUser');
    if (user) {
      let userObj = JSON.parse(user);
      this.email = userObj?.email;
    }
    let product = localStorage.getItem('product');
    if (product) {
      let productObj = JSON.parse(product);
      this.productId = productObj?.id;
    }
  }

  get feedback() {
    this.constructor.name;
    return this.bugReportForm.controls;
  }

  ngOnInit(): void {
    this.convertBase64ToFile();
    this.prepareFormData();
    this.prioritiesData();
    this.screenshotName.push(this.getMeComponent());
  }

  convertBase64ToFile(): void {
    const base64Data = this.screenshot.split(',')[1];
    this.images.push(this.screenshot);
    this.fileService
      .base64ToFile(base64Data, this.getMeComponent())
      .subscribe((file) => {
        this.uploadedFile.push(file);
      });
  }
  prioritiesData() {
    this.commonApi
      .get('lookup-code?lookupType=BUG_SEVERITY')
      .then((res: any) => {
        this.priorities = res.data;
      });
  }
  prepareFormData(): void {
    let meta_data = localStorage.getItem('meta_data');
    if (meta_data) {
      this.products = JSON.parse(meta_data);
      let product = localStorage.getItem('product');
      if (product) {
        this.bugReportForm.patchValue({ product: JSON.parse(product).id });
      }
    }
    this.bugReportForm.patchValue({ section: this.getMeComponent() });
  }

  getMeComponent() {
    let comp = '';
    switch (window.location.hash) {
      case '#/dashboard':
        comp = 'Dashboard';
        break;
      case '#/overview':
        comp = 'Overview';
        break;
      case '#/usecases':
        comp = 'Usecase';
        break;
      case '#/configuration/workflow/overview':
        comp = 'Xflows';
        break;
      case '#/configuration/data-model/overview':
        comp = 'Data Models';
        break;
      case '#/operate':
        comp = 'Operate';
        break;
      case '#/publish':
        comp = 'Publish';
        break;
      case '#/my-products':
        comp = 'My Product';
        break;
      case '#/configuration/api-integration':
        comp = 'API Integration';
        break;
      case '#/acitvity':
        comp = 'Activity';
        break;
      case '#/operate':
        comp = 'Operate';
        break;
      case '#/workspace':
        comp = 'Workspace';
        break;
      case '#/brand-guideline':
        comp = 'Brand Guideline';
        break;
      case '#/about-your-self':
        comp = 'About your self';
        break;
      case '#/x-pilot':
        comp = 'Xpilot';
        break;
      case '#/admin/user-invitation':
        comp = 'User Invitation';
        break;
      case '#/operate/change/history-log':
        comp = 'History Log';
        break;
      case '#/admin/user-approval':
        comp = 'User Approval';
        break;
      case '#/dynamic-form':
        comp = 'Dynamic Form';
        break;
      case '#/help-center':
        comp = 'Help Center';
        break;
      case '#/feedback-list':
        comp = 'Feedback List';
        break;
      case '#/specification':
        comp = 'Specification';
        break;
      default:
        break;
    }
    return comp;
  }

  ngOnChanges(changes: SimpleChanges): void {}

  feedbackReport(value: any) {
    this.submitted = true;
    this.isFormSubmitted = true;
    if (this.bugReportForm.valid) {
      this.isInvalid = false;
      this.onFileDropped();
    } else {
      this.isInvalid = true;
      console.log('error');
    }
    this.auditUtil.postAudit('BUG_REPORT', 1, 'SUCCESS', 'user-audit');
  }

  async onFileDropped($event?: any) {
    this.utils.loadSpinner(true);
    if (!$event) {
      $event = this.screenshot;
    }
    const promises = this.uploadedFile.map(async (file: any, key: any) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('containerName', 'user-feedback');
      const headers = {
        'Content-Type': 'application/json',
      };
      return this.fileUploadCall(formData, headers);
    });
    const responses = await Promise.all(promises);
    responses.forEach((response) => {
      if (response?.fileId) {
        this.bugReportFiles.push(response);
      }
    });
    this.sendBugReport();
  }

  fileUploadCall(formData: any, headers: any) {
    let data: any;
    return new Promise((resolve, reject) => {
      this.commonApi
        .uploadFile(formData, { headers })
        .then((res: any) => {
          if (res) {
            data = {
              fileId: res.data.id,
              userFileType: 'bug-report',
            };
            let user_audit_body = {
              method: 'POST',
              url: res?.request?.responseURL,
              payload: 'file',
            };
            this.auditUtil.postAudit(
              'FILE_DROP_FILE_AZURE_UPLOAD_REPORT_BUG',
              1,
              'SUCCESS',
              'user-audit',
              user_audit_body,
              this.email,
              this.productId
            );
            if (data?.fileId) {
              resolve(data);
            }
          } else {
            let user_audit_body = {
              method: 'POST',
              url: res?.request?.responseURL,
              payload: formData,
            };
            this.auditUtil.postAudit(
              'FILE_DROP_FILE_AZURE_UPLOAD_REPORT_BUG',
              1,
              'FAILED',
              'user-audit',
              user_audit_body,
              this.email,
              this.productId
            );
            this.utils.loadToaster({
              severity: 'error',
              summary: 'Error',
              detail: res?.data,
            });
            this.utils.loadSpinner(false);
          }
        })
        .catch((err: any) => {
          let user_audit_body = {
            method: 'POST',
            url: err?.request?.responseURL,
            payload: formData,
          };
          this.auditUtil.postAudit(
            'FILE_DROP_FILE_AZURE_UPLOAD_REPORT_BUG',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.email,
            this.productId
          );
          this.utils.loadToaster({
            severity: 'error',
            summary: 'Error',
            detail: err,
          });
          this.utils.loadSpinner(false);
        });
    });
  }

  sendBugReport(): void {
    const body = {
      userId: this.currentUser?.user_id,
      productId: this.bugReportForm.value.product,
      componentId: this.bugReportForm.value.section,
      feedbackText: this.bugReportForm.value.feedbackText,
      severityId: this.bugReportForm.value.severityId,
      feedbackStatusId: 'Open',
      requestTypeId: 'bug-report',
      internalTicketId: '-',
      userFiles: this.bugReportFiles,
    };
    this.userUtilsApi
      .userBugReport(body)
      .then((res: any) => {
        if (!res?.data?.detail) {
          let user_audit_body = {
            method: 'POST',
            url: res?.request?.responseURL,
            payload: body,
          };
          this.auditUtil.postAudit(
            'SEND_USER_BUG_REPORT_REPORT_BUG',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.email,
            this.productId
          );
          this.utils.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail: 'Bug reported successfully',
          });
          this.utils.showFeedbackPopupByType('thankyou');
        } else {
          let user_audit_body = {
            method: 'POST',
            url: res?.request?.responseURL,
            payload: body,
          };
          this.auditUtil.postAudit(
            'SEND_USER_BUG_REPORT_REPORT_BUG',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.email,
            this.productId
          );
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res?.data?.detail,
          });
        }
        this.bugReportFiles = [];
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        let user_audit_body = {
          method: 'POST',
          url: err?.request?.responseURL,
          payload: body,
        };
        this.auditUtil.postAudit(
          'SEND_USER_BUG_REPORT_REPORT_BUG',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.email,
          this.productId
        );
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
        this.utils.loadSpinner(false);
        this.bugReportFiles = [];
      });
  }

  onDeleteImage(i: any) {
    _.pullAt(this.uploadedFile, i);
    _.pullAt(this.screenshotName, i);
    _.pullAt(this.images, i);
  }

  fileBrowseHandler(files: any) {
    this.files = [];
    this.prepareFilesList(files);
    this.bugReportForm.patchValue({
      screenshot: files[0], // Update the value of the screenshot control
    });
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

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

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      if (this.files) {
        this.files.push(item);
      }
    }
    this.uploadFilesSimulator(0);
  }

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
      this.feedbackReport('thankYou');
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

  routeToFeedbackList() {
    this.closePopup();
    this.router.navigate(['/feedback-list']);
  }

  closePopup() {
    this.utils.showFeedbackPopupByType('');
  }
  onUploadIconClick() {
    if (this.fileInput) this.fileInput.nativeElement.click();
  }
  onFileInput(event: Event) {
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB in bytes
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      if (files[0].size > maxSizeInBytes) {
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: 'File size should not exceed 5mb',
        });
      } else {
        this.handleFiles(files);
      }
    }
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    const fileName = selectedFile.name;
    if (selectedFile) {
      this.readFileContent(selectedFile, fileName);
    }
  }

  private readFileContent(file: File, fileName: string) {
    this.screenshotName.push(fileName);
    var reader = new FileReader();
    this.uploadedFile.push(file);
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      if (e?.target) {
        this.screenshot = e?.target.result;
        this.images.push(e?.target?.result);
      }
      this.uploadedFile = _.uniq(this.uploadedFile);
      this.images = _.uniq(this.images);
      this.screenshotName = _.uniq(this.screenshotName);
    };
    reader.readAsArrayBuffer(file);
  }

  onDragOver(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.highlightDragDropArea(true);
  }

  onDragLeave(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.highlightDragDropArea(false);
  }

  onDrop(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.highlightDragDropArea(false);
    let files;
    if (event && (event as DragEvent).dataTransfer) {
      const x = (event as DragEvent).dataTransfer;
      if (x) files = x.files;
    }
    if (files && files.length > 0) {
      this.handleFiles(files);
      this.uploadedFile = files[0];
    }
  }

  private handleFiles(files: FileList) {
    this.readFileContent(files[0], files[0].name);
  }

  private highlightDragDropArea(highlight: boolean) {
    let container: any;
    if (this.fileInput) container = this.fileInput.nativeElement.parentElement;
    if (highlight) {
      container.classList.add('dragging-over');
    } else {
      container.classList.remove('dragging-over');
    }
  }

  // onProductChange(event: any) {
  //   this.selectedProductId = event.value;
  // }
}
