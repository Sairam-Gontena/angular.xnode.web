import { Component, EventEmitter, HostListener, Input, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../services/utils.service';
import { CommonApiService } from 'src/app/api/common-api.service';
import { UserUtilsService } from 'src/app/api/user-utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service'
import { FileService } from 'src/app/file.service';
import * as _ from "lodash";
import { Router } from '@angular/router';
@Component({
  selector: 'xnode-general-feedback',
  templateUrl: './general-feedback.component.html',
  styleUrls: ['./general-feedback.component.scss']
})

export class GeneralFeedbackComponent implements OnInit {
  @ViewChild('fileInput') fileInput?: ElementRef;
  @Input() visible: any;
  @Input() screenshot: any;
  @Output() dataActionEvent = new EventEmitter<any>();
  @Input() thanksDialog = false;
  screenshotName: any[] = []; //"Image";
  formGroup!: FormGroup;
  generalFeedbackForm: FormGroup;
  dialogWidth: any;
  dialogHeight: any;
  getScreenWidth: any;
  submitted: boolean = false;
  isFormSubmitted: boolean = false;
  isInvalid: boolean = false;
  value!: number;
  feedbackForm: any;
  isPlaceholderVisible: boolean = false;
  draganddropSelected: boolean = false;
  browserSelected: boolean = false;
  uploadedFileData: any = [];
  currentUser?: any;
  rating: any;
  isHovered: boolean = false;
  selectedRating: string | null = null;
  onHoveredIcon: string | null = null;
  products: any[] = [];
  uploadedFile: any = [];
  email: any;
  productId: any;
  images: any = [];
  feedbackReportFiles: any = [];

  constructor(public utils: UtilsService,
    private fb: FormBuilder,
    private commonApi: CommonApiService,
    private userUtilsApi: UserUtilsService,
    private auditUtil: AuditutilsService,
    private fileService: FileService,
    private router: Router) {
    this.onWindowResize();
    this.generalFeedbackForm = this.fb.group({
      product: [localStorage.getItem('app_name'), Validators.required],
      section: [this.getMeComponent(), Validators.required],
      tellUsMore: ['', Validators.required],
      screenshot: [null],
      selectedRating: ['', Validators.required]
    });
    let user = localStorage.getItem('currentUser')
    if (user) {
      let userObj = JSON.parse(user)
      this.email = userObj?.email;
    }
    let product = localStorage.getItem('product')
    if (product) {
      let productObj = JSON.parse(product)
      this.productId = productObj?.id;
    }
  }

  @HostListener('window:resize', ['$event'])

  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 780) {
      this.dialogWidth = '90vw';
      this.dialogHeight = '90vh';
    } else if (this.getScreenWidth > 780 && this.getScreenWidth < 980) {
      this.dialogWidth = '75vw';
      this.dialogHeight = '80vh';
    } else if (this.getScreenWidth > 980) {
      this.dialogWidth = '40vw';
    }
  }

  get feedback() {
    return this.generalFeedbackForm.controls;
  }
  ngOnInit(): void {
    this.convertBase64ToFile();
    this.prepareFormData();
    this.screenshotName.push(this.getMeComponent());
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser)
      this.currentUser = JSON.parse(currentUser)
  }

  convertBase64ToFile(): void {
    const base64Data = this.screenshot.split(',')[1];
    this.images.push(this.screenshot)
    this.fileService.base64ToFile(base64Data, this.getMeComponent()).subscribe((file: any) => {
      this.uploadedFile.push(file);
    });
  }

  prepareFormData(): void {
    let meta_data = localStorage.getItem('meta_data')
    if (meta_data) {
      this.products = JSON.parse(meta_data);
      let product = localStorage.getItem('product');
      if (product) {
        this.generalFeedbackForm.patchValue({ 'product': JSON.parse(product).id });
      }
    }
    this.formGroup = new FormGroup({
      value: new FormControl(this.rating)
    });
  }

  getMeComponent() {
    let comp = '';
    switch (window.location.hash) {
      case '#/dashboard':
        comp = 'Dashboard'
        break;
      case '#/overview':
        comp = 'Overview'
        break;
      case '#/usecases':
        comp = 'Usecase'
        break;
      case '#/configuration/workflow/overview':
        comp = 'Xflows'
        break;
      case '#/configuration/data-model/overview':
        comp = 'Data Models'
        break;
      case '#/operate':
        comp = 'Operate'
        break;
      case '#/publish':
        comp = 'Publish'
        break;
      case '#/my-products':
        comp = 'My Product'
        break;
      case '#/configuration/api-integration':
        comp = 'API Integration'
        break;
      case '#/acitvity':
        comp = 'Activity'
        break;
      case '#/operate':
        comp = 'Operate'
        break;
      case '#/workspace':
        comp = 'Workspace'
        break;
      case '#/brand-guideline':
        comp = 'Brand Guideline'
        break;
      case '#/about-your-self':
        comp = 'About your self'
        break;
      case '#/x-pilot':
        comp = 'Xpilot'
        break;
      case '#/admin/user-invitation':
        comp = 'User Invitation'
        break;
      case '#/operate/change/history-log':
        comp = 'History Log'
        break;
      case '#/admin/user-approval':
        comp = 'User Approval'
        break;
      case '#/dynamic-form':
        comp = 'Dynamic Form'
        break;
      case '#/help-center':
        comp = 'Help Center'
        break;
      case '#/feedback-list':
        comp = 'Feedback List'
        break;
      case '#/specification':
        comp = 'Specification'
        break;
      default:
        break;
    }
    return comp;
  }

  sendFeedback(value: any) {
    // this.dataActionEvent.emit({ value: 'thankYou' })
    this.submitted = true;
    if (this.generalFeedbackForm.valid) {
      this.onFileDropped()
    } else {
      console.log("error");
    }
  }

  onDeleteImage(i: any) {
    _.pullAt(this.uploadedFile, i);
    _.pullAt(this.screenshotName, i);
    _.pullAt(this.images, i);
  }
  files: any[] = [];

  sendGeneralFeedbackReport(): void {
    const body = {
      "userId": this.currentUser?.user_id,
      "productId": this.generalFeedbackForm.value.product,
      "componentId": this.generalFeedbackForm.value.section,
      "feedbackText": this.generalFeedbackForm.value.tellUsMore,
      "feedbackRatingId": this.generalFeedbackForm.value.selectedRating,
      "feedbackStatusId": "Open",
      "userFiles": this.feedbackReportFiles
    }
    this.userUtilsApi.post(body, 'user-feedback').then((res: any) => {
      if (!res?.data?.detail) {
        let user_audit_body = {
          'method': 'POST',
          'url': res?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.post('USER_FEEDBACK_SEND_GENERAL_FEEDBACK_REPORT', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'Bug reported successfully' });
        this.utils.showFeedbackPopupByType('thankyou');
        this.auditUtil.post("GENERAL_FEEDBACK", 1, 'SUCCESS', 'user-audit');
      } else {
        let user_audit_body = {
          'method': 'POST',
          'url': res?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.post('USER_FEEDBACK_SEND_GENERAL_FEEDBACK_REPORT', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: res?.data?.detail });
        this.auditUtil.post("GENERAL_FEEDBACK_" + res?.data?.detail, 1, 'FAILURE', 'user-audit');
      }
      this.utils.loadSpinner(false);
      this.feedbackReportFiles = []
    }).catch(err => {
      let user_audit_body = {
        'method': 'POST',
        'url': err?.request?.responseURL,
        'payload': body
      }
      this.auditUtil.post('USER_FEEDBACK_SEND_GENERAL_FEEDBACK_REPORT', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
      this.utils.loadSpinner(false);
      this.feedbackReportFiles = []
      this.auditUtil.post("GENERAL_FEEDBACK_" + err, 1, 'FAILURE', 'user-audit');
    })
  }

  routeToFeedbackList() {
    this.closePopup();
    this.router.navigate(['/feedback-list'])
  }

  onFileDropped($event?: any) {
    this.utils.loadSpinner(true);
    if (!$event) {
      $event = this.screenshot;
    }
    this.uploadedFile.forEach((file: any, key: any) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('containerName', 'user-feedback');
      const headers = {
        'Content-Type': 'application/json',
      };
      let bool;
      if (key + 1 != this.uploadedFile.length) {
        bool = false;
        this.fileUploadCall(formData, headers, bool)
      } else {
        bool = true;
        this.fileUploadCall(formData, headers, bool)
      }
    });
  }

  fileUploadCall(formData: any, headers: any, lastIndex: boolean) {
    this.commonApi.post('file-azure/upload', formData, { headers }).then((res: any) => {
      if (res) {
        let data = {
          "fileId": res.data.id,
          "userFileType": "feedback-report"
        }
        this.feedbackReportFiles.push(data)
        if (lastIndex) {
          this.sendGeneralFeedbackReport();
        }
        let user_audit_body = {
          'method': 'POST',
          'url': res?.request?.responseURL,
          'payload': 'files'
        }
        this.auditUtil.post('FILE_DROP_FILE_AZURE_UPLOAD_GENERAL_FEEDBACK', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
      } else {
        let user_audit_body = {
          'method': 'POST',
          'url': res?.request?.responseURL,
          'payload': 'files'
        }
        this.auditUtil.post('FILE_DROP_FILE_AZURE_UPLOAD_GENERAL_FEEDBACK', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: res?.data });
        this.utils.loadSpinner(false);
      }
    }).catch((err: any) => {
      let user_audit_body = {
        'method': 'POST',
        'url': err?.request?.responseURL,
        'payload': 'files'
      }
      this.auditUtil.post('FILE_DROP_FILE_AZURE_UPLOAD_GENERAL_FEEDBACK', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });
      this.utils.loadSpinner(false);
    })
  }

  fileBrowseHandler(files: any) {
    this.files = [];
    this.prepareFilesList(files);
    this.generalFeedbackForm.patchValue({
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
      this.sendFeedback('thankYou');
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

  closePopup() {
    this.utils.showFeedbackPopupByType('');
  }
  onStarClick(rating: string) {
    this.selectedRating = rating;
    this.generalFeedbackForm.get('selectedRating')?.setValue(rating);
  }
  onHoverStar(rating: string) {
    this.onHoveredIcon = rating;
  }
  onFileInput(event: Event) {
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB in bytes
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      if (files[0].size > maxSizeInBytes) {
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: 'File size should not exceed 5mb' });
      } else {
        this.handleFiles(files);
        this.uploadedFile = files[0];
      }
    }
  }

  onUploadIconClick() {
    if (this.fileInput)
      this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    const fileName = selectedFile.name;
    if (selectedFile) {
      this.readFileContent(selectedFile, fileName);
      this.uploadedFile = selectedFile;
    }
  }

  private readFileContent(file: File, fileName: string) {
    this.screenshotName.push(fileName); // this.screenshotName = fileName;
    const reader = new FileReader();
    // this.uploadedFile = file;
    this.uploadedFile.push(file)
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      // if (e?.target)
      //   this.screenshot = e?.target.result;
      if (e?.target) {
        this.screenshot = e?.target.result;
        this.images.push(e?.target?.result)
      }
      this.uploadedFile = _.uniq(this.uploadedFile)
      this.images = _.uniq(this.images)
      this.screenshotName = _.uniq(this.screenshotName)
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
      if (x)
        files = x.files
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
    if (this.fileInput)
      container = this.fileInput.nativeElement.parentElement;
    if (highlight) {
      container.classList.add('dragging-over');
    } else {
      container.classList.remove('dragging-over');
    }
  }
}
