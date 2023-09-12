import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserUtilsService } from 'src/app/api/user-utils.service';
import { User, UserUtil } from 'src/app/utils/user-util';
import { UtilsService } from '../services/utils.service';
import { CommonApiService } from 'src/app/api/common-api.service';
import { AuditutilsService } from 'src/app/api/auditutils.service'
import * as _ from "lodash";
@Component({
  selector: 'xnode-report-bug',
  templateUrl: './report-bug.component.html',
  styleUrls: ['./report-bug.component.scss']
})

export class ReportBugComponent implements OnInit {
  @ViewChild('fileInput') fileInput?: ElementRef;
  @Input() visible = false;
  @Input() screenshot: any[] = []; // @Input() screenshot: any; original
  @Output() dataActionEvent = new EventEmitter<any>();
  @Output() backEvent = new EventEmitter<boolean>();
  @Input() thanksDialog = false;
  @Input() templates: any[] = [];
  public getScreenWidth: any;
  public dialogWidth: string = '40vw';
  modalPosition: any;
  currentUser?: User;
  submitted: boolean = false;
  feedbackForm: FormGroup;
  priorities: any[] = [];
  isFormSubmitted: boolean = false;
  brandguidelinesForm: any;
  isInvalid: boolean = false;
  isPlaceholderVisible: boolean = false;
  draganddropSelected: boolean = false;
  browserSelected: boolean = true;
  files: any[] = [];
  imageUrl: any;
  images: any = [];
  uploadedFileData: any;
  screenshotName: any[] = ['Image']; //   screenshotName = 'Image'; original

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 780) {
      this.modalPosition = 'bottom';
      this.dialogWidth = '100vw';
    } else if (this.getScreenWidth > 780 && this.getScreenWidth < 980) {
      this.modalPosition = 'center'
      this.dialogWidth = '75vw';
    } else if (this.getScreenWidth > 980) {
      this.modalPosition = 'center'
      this.dialogWidth = '40vw';
    }
  }

  constructor(private fb: FormBuilder, private userUtilsApi: UserUtilsService,
    public utils: UtilsService, private commonApi: CommonApiService, private auditUtil: AuditutilsService) {
    this.currentUser = UserUtil.getCurrentUser();
    this.onWindowResize();
    this.feedbackForm = this.fb.group({
      product: [localStorage.getItem('app_name'), Validators.required],
      section: [this.getMeComponent(), Validators.required],
      severityId: ['', Validators.required],
      feedbackText: ['', Validators.required],
      screenshot: [null]
    });
  }

  get feedback() {
    this.constructor.name
    return this.feedbackForm.controls;
  }

  ngOnInit(): void {
    this.priorities = [
      { name: 'Low', code: 'Low' },
      { name: 'Medium', code: 'Medium' },
      { name: 'High', code: 'High' }
    ];
    this.feedbackForm.patchValue({ 'section': this.getMeComponent() });
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
      default:
        break;
    }
    return comp;
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  feedbackReport(value: any) {
    this.submitted = true;
    this.isFormSubmitted = true;
    if (this.feedbackForm.valid) {
      this.isInvalid = false;
      this.onFileDropped()
    } else {
      this.isInvalid = true;
      console.log("error");
    }
    this.auditUtil.post('BUG_REPORT', 1, 'SUCCESS', 'user-audit');
  }

  sendBugReport(): void {
    const body = {
      "userId": this.currentUser?.id,
      "productId": localStorage.getItem('record_id'),
      "componentId": this.feedbackForm.value.section,
      "feedbackText": this.feedbackForm.value.feedbackText,
      "severityId": this.feedbackForm.value.severityId,
      "feedbackStatusId": "Open",
      "requestTypeId": "bug-report",
      "internalTicketId": '-',
      "userFiles": [
        {
          "fileId": this.uploadedFileData.id,
          "userFileType": "doc"
        }
      ]
    }
    this.userUtilsApi.post(body, 'user-bug-report').then((res: any) => {
      if (!res?.data?.detail) {
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'Bug reported successfully' });
        this.utils.showFeedbackPopupByType('thankyou');
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: res?.data?.detail });
      }
      this.utils.loadSpinner(false);
    }).catch(err => {
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
      this.utils.loadSpinner(false);
    })
  }

  onDeleteImage(i: any) {
    _.pullAt(this.screenshot, i);
    _.pullAt(this.screenshotName, i);
  }

  onFileDropped($event?: any) {
    this.utils.loadSpinner(true);
    if (!$event) {
      $event = this.screenshot;
    }
    const formData = new FormData();
    formData.append('file', new Blob([$event]));
    formData.append('containerName', 'user-feedback');
    const headers = {
      'Content-Type': 'application/json',
    };

    this.commonApi.post('/file-azure/upload', formData, { headers }).then((res: any) => {
      if (res) {
        this.uploadedFileData = res.data;
        this.sendBugReport();
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: res?.data });
        this.utils.loadSpinner(false);
      }
    }).catch((err: any) => {
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });
      this.utils.loadSpinner(false);
    })
  }

  fileBrowseHandler(files: any) {
    this.files = [];
    this.prepareFilesList(files);
    this.feedbackForm.patchValue({
      screenshot: files[0] // Update the value of the screenshot control
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

  closePopup() {
    this.utils.showFeedbackPopupByType('');
  }
  onUploadIconClick() {
    if (this.fileInput)
      this.fileInput.nativeElement.click();
  }
  onFileInput(event: Event) {
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB in bytes
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      if (files[0].size > maxSizeInBytes) {
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: 'File size should not exceed 5mb' });
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

  private readFileContent(file: any, fileName: any) {
    // this.screenshotName = fileName;  org start
    // reader.readAsDataURL(file);
    // reader.onload = (e) => {
    //   if (e?.target)
    //     this.screenshot = e?.target.result;
    // };
    // reader.readAsArrayBuffer(file);   org ends
    this.screenshotName = _.uniq(_.concat(this.screenshotName, fileName))
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e?.target) {
        this.images.push(e?.target.result);
        // this.screenshot = e?.target.result;  //here push
      }
      this.screenshot = _.uniq(_.concat(this.screenshot, this.images))
    }

    reader.readAsDataURL(file);
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
    }
  }

  private handleFiles(files: any) {
    // this.readFileContent(files[0], files[0].name);
    Object.values(files).forEach((value) => {
      if (value instanceof File) {
        this.readFileContent(value, value.name);
      }
    });
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
