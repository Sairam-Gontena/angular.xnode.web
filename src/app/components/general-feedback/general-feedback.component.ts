import { Component, EventEmitter, HostListener, Input, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../services/utils.service';
import { CommonApiService } from 'src/app/api/common-api.service';
import { User, UserUtil } from 'src/app/utils/user-util';
import { UserUtilsService } from 'src/app/api/user-utils.service';
import { AuditutilsService } from '../../api/auditUtils.service';



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
  screenshotName = "Image";
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
  uploadedFileData: any;
  currentUser?: any;
  rating: number = 3

  constructor(public utils: UtilsService,
    private fb: FormBuilder, private commonApi: CommonApiService, private userUtilsApi: UserUtilsService, private auditUtil: AuditutilsService) {
    this.onWindowResize();
    this.generalFeedbackForm = this.fb.group({
      product: [localStorage.getItem('app_name'), Validators.required],
      section: [this.getMeComponent(), Validators.required],
      tellUsMore: ['', Validators.required],
      screenshot: [null],
      // logoFile: [null, Validators.required],
      rating: [this.rating, Validators.required]
    });
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
    this.formGroup = new FormGroup({
      value: new FormControl(this.rating)
    });
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser)
      this.currentUser = JSON.parse(currentUser)
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

  sendFeedback(value: any) {
    // this.dataActionEvent.emit({ value: 'thankYou' })
    this.submitted = true;
    if (this.generalFeedbackForm.valid) {
      this.onFileDropped()
    } else {
      console.log("error");

    }
  }

  onDeleteImage() {
    this.screenshot = '';
  }
  files: any[] = [];

  sendGeneralFeedbackReport(): void {
    const body = {
      "userId": this.currentUser?.user_id,
      "productId": localStorage.getItem('record_id'),
      "componentId": this.generalFeedbackForm.value.section,
      "feedbackText": this.generalFeedbackForm.value.tellUsMore,
      "feedbackRatingId": this.generalFeedbackForm.value.rating,
      "feedbackStatusId": "new",
      "userFiles": [
        {
          "fileId": this.uploadedFileData.id,
          "userFileType": "doc"
        }
      ]
    }
    console.log(body)
    this.userUtilsApi.post(body, 'user-feedback').then((res: any) => {
      if (!res?.data?.detail) {
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'Bug reported successfully' });
        this.utils.showFeedbackPopupByType('thankyou');
        this.auditUtil.post("GENERAL_FEEDBACK", 1, 'SUCCESS', 'user-audit');

      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: res?.data?.detail });
        this.auditUtil.post("GENERAL_FEEDBACK", 1, 'FAILURE', 'user-audit');
      }
      this.utils.loadSpinner(false);
    }).catch(err => {
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
      this.utils.loadSpinner(false);
      this.auditUtil.post("GENERAL_FEEDBACK", 1, 'FAILURE', 'user-audit');

    })
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

    this.commonApi.post('file-azure/upload', formData, { headers }).then((res: any) => {
      if (res) {
        this.uploadedFileData = res.data;
        this.sendGeneralFeedbackReport();
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

  gotRating(val: any) {
    this.rating = val.value
    console.log(this.rating)
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

  onUploadIconClick() {
    if (this.fileInput)
      this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    const fileName = selectedFile.name;
    if (selectedFile) {
      this.readFileContent(selectedFile, fileName);
    }
  }

  private readFileContent(file: File, fileName: string) {
    this.screenshotName = fileName;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      if (e?.target)
        this.screenshot = e?.target.result;
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
