import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxCaptureService } from 'ngx-capture';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/api/api.service';
import { WebSocketService } from 'src/app/web-socket.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'xnode-general-feedback',
  templateUrl: './general-feedback.component.html',
  styleUrls: ['./general-feedback.component.scss']
})
export class GeneralFeedbackComponent implements OnInit {
  @Input() generalFeedbackDialog = false;
  @Input() screenshot: any;
  @Output() dataActionEvent = new EventEmitter<any>();
  @Input() thanksDialog = false;

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

  constructor(private apiService: ApiService, private utilsService: UtilsService,
    private router: Router, private webSocketService: WebSocketService,
    private confirmationService: ConfirmationService, private fb: FormBuilder, private captureService: NgxCaptureService) {
    this.onWindowResize();
    this.generalFeedbackForm = this.fb.group({
      product: [localStorage.getItem('app_name'), Validators.required],
      section: [this.getMeComponent(), Validators.required],
      tellUsMore: ['', Validators.required],
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
    this.dataActionEvent.emit({ value: 'thankYou' })
    this.submitted = true;
    if (this.generalFeedbackForm.valid) {
      const formValues = this.generalFeedbackForm.value;
      console.log(formValues);
    } else {
      console.log("error");

    }
  }
  customFeedback(value: any) {
    this.dataActionEvent.emit({ value: 'feedback' })

  }
  onDeleteImage() {
    this.screenshot = '';
  }
  files: any[] = [];
  onFileDropped($event: any) {
    this.prepareFilesList($event);
    this.generalFeedbackForm.patchValue({
      logoFile: $event[0]
    });
  }
  /**
    * handle file from browsing
    */
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
}
