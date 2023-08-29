import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxCaptureService } from 'ngx-capture';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/api/api.service';
import { WebSocketService } from 'src/app/web-socket.service';
import { UtilsService } from '../services/utils.service';
import { tap } from 'rxjs';

@Component({
  selector: 'xnode-all-feedback',
  templateUrl: './all-feedback.component.html',
  styleUrls: ['./all-feedback.component.scss']
})
export class AllFeedbackComponent implements OnInit {
  @Input() showDialog = false;
  @Input() screenshot: any;

  products: any[] = [];
  submitted: boolean  = false;
  isFormSubmitted: boolean  = false;
  brandguidelinesForm: any;
  isInvalid: boolean = false;
  isPlaceholderVisible: boolean  = false;
  draganddropSelected: boolean  = false;
  browserSelected!: boolean;
  feedbackForm: FormGroup;
  
  constructor(private apiService: ApiService, private utilsService: UtilsService,
    private router: Router, private webSocketService: WebSocketService,
    private confirmationService: ConfirmationService,private fb: FormBuilder, private captureService: NgxCaptureService) {
      this.feedbackForm = this.fb.group({
        product: ['', Validators.required],
        component: ['', Validators.required],
        helpUsImprove: ['', Validators.required],
        logoFile: [null, Validators.required]
      });
  }
  get feedback() {
    return this.feedbackForm.controls; }

  ngOnInit(): void {
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
  
}
