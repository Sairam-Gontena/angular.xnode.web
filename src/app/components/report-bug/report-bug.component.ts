import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserUtilsService } from 'src/app/api/user-utils.service';
import { User, UserUtil } from 'src/app/utils/user-util';
import { UtilsService } from '../services/utils.service';
import { CommonApiService } from 'src/app/api/common-api.service';

@Component({
  selector: 'xnode-report-bug',
  templateUrl: './report-bug.component.html',
  styleUrls: ['./report-bug.component.scss']
})

export class ReportBugComponent implements OnInit {
  @Input() displayReportDialog = false;
  @Input() screenshot: any;
  @Output() dataActionEvent = new EventEmitter<any>();
  @Output() backEvent = new EventEmitter<boolean>();
  @Input() thanksDialog = false;
  @Input() templates: any[] = [];
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

  constructor(private fb: FormBuilder, private userUtilsApi: UserUtilsService,
    private utils: UtilsService, private commonApi: CommonApiService) {
    this.currentUser = UserUtil.getCurrentUser();
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
    console.log(this.screenshot)
    this.priorities = [
      { name: 'Choose Priority', code: 'choose priority' },
      { name: 'Urgent', code: 'urgent' },
    ];
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
  }

  sendBugReport(): void {
    this.utils.loadSpinner(true);
    const body = {
      "userId": this.currentUser?.id,
      "productId": localStorage.getItem('record_id'),
      "componentId": this.feedbackForm.value.component,
      "feedbackText": this.feedbackForm.value.feedbackText,
      "severityId": this.feedbackForm.value.severityId,
      "requestTypeId": "REPORT_BUG_1",
      // "userFiles": [
      //   {
      //     "fileId": "string",
      //     "conversationSourceId": "string",
      //     "conversationSourceType": "string",
      //     "userFileType": "string"
      //   }
      // ]
    }
    this.userUtilsApi.post(body, 'user-bug-report').then((res: any) => {
      if (res) {
        console.log("res", res)

        this.dataActionEvent.emit({ value: 'thankYou' });
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: res?.data });
        this.utils.loadSpinner(false);
      }
    }).catch(err => {
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });
      this.utils.loadSpinner(false);
    })
  }

  customFeedback(value: any) {
    this.dataActionEvent.emit({ value: 'feedback' })
  }

  onDeleteImage() {
    this.screenshot = '';
  }

  onFileDropped($event?: any) {
    this.utils.loadSpinner(true);
    if (!$event) {
      $event = this.files;
    }

    const body = {
      "containerName": "user-feedback",
      "Property": "file"
    }
    const headers = {
      'Content-Type': 'application/json',
    };

    this.commonApi.post('/file-azure/upload', body, { headers }).then((res: any) => {
      if (res) {
        console.log("res", res)
        // this.imageUrl = res;
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

}
