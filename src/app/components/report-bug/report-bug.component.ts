import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxCaptureService } from 'ngx-capture';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/api/api.service';
import { WebSocketService } from 'src/app/web-socket.service';
import { UtilsService } from '../services/utils.service';
import { tap } from 'rxjs';

@Component({
  selector: 'xnode-report-bug',
  templateUrl: './report-bug.component.html',
  styleUrls: ['./report-bug.component.scss']
})
export class ReportBugComponent implements OnInit {
  @Input() displayReportDialog = false;
  @Input() screenshot: any;
  // @Output() dataActionEvent = new EventEmitter<object>();
  @Output() dataActionEvent = new EventEmitter<any>();
  @Output() backEvent = new EventEmitter<boolean>();

  @Input() thanksDialog = false;
  @Input() templates: any[] = [];

  submitted: boolean = false;
  feedbackForm: FormGroup;
  // thanksDialog: boolean = false;
  priorities: any[] = [];
  isFormSubmitted: boolean = false;
  brandguidelinesForm: any;
  isInvalid: boolean = false;
  isPlaceholderVisible: boolean = false;
  draganddropSelected: boolean = false;
  browserSelected: boolean = true;

  constructor(private apiService: ApiService, private utilsService: UtilsService,
    private router: Router, private webSocketService: WebSocketService,
    private confirmationService: ConfirmationService, private fb: FormBuilder, private captureService: NgxCaptureService) {

    this.constructor.name; // Component name
    console.log('this', this.constructor.name);

    this.feedbackForm = this.fb.group({
      product: ['', Validators.required],
      section: ['', Validators.required],
      priority: ['', Validators.required],
      helpUsImprove: ['', Validators.required],
      logoFile: [null, Validators.required]

    });

  }
  get feedback() {
    this.constructor.name

    return this.feedbackForm.controls;
  }

  ngOnInit(): void {
    this.priorities = [
      { name: 'Choose Priority', code: 'choose priority' },
      { name: 'Urgent', code: 'urgent' },
    ];
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.templates)
  }
  feedbackReport(value: any) {
    this.dataActionEvent.emit({ value: 'thankYou' })
    this.submitted = true;
    this.isFormSubmitted = true;
    if (this.feedbackForm.valid) {
      this.isInvalid = false;
      const formValues = this.feedbackForm.value;
      console.log(formValues);
    } else {
      this.isInvalid = true;
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
