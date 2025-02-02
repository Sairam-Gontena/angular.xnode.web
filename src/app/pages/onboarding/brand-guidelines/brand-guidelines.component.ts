import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'xnode-brand-guidelines',
  templateUrl: './brand-guidelines.component.html',
  styleUrls: ['./brand-guidelines.component.scss']
})
export class BrandGuidelinesComponent implements OnInit {
  brandguidelinesForm!: FormGroup;
  submitted: boolean = false;
  isInvalid: boolean = false;
  isPlaceholderVisible: boolean = true;
  isFormSubmitted!: boolean;
  draganddropSelected!: boolean;
  browserSelected!: boolean;
  errorMessage!: string;
  constructor(private formBuilder: FormBuilder, public router: Router) {
    this.brandguidelinesForm = this.formBuilder.group({
      workspaceName: ['', Validators.required],
      logoFile: [null, Validators.required]
    });
  }
  get Form() { return this.brandguidelinesForm.controls; }
  ngOnInit(): void {
    this.brandguidelinesForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }
  files: any[] = [];
  onFileDropped($event: any) {
    this.prepareFilesList($event);
    this.brandguidelinesForm.patchValue({
      logoFile: $event[0]
    });
  }
  /**
    * handle file from browsing
    */
  fileBrowseHandler(files: any) {
    this.files = [];
    this.prepareFilesList(files);
    this.brandguidelinesForm.patchValue({
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
  onClickbrandGuideLine() {
    this.submitted = true;
    this.isFormSubmitted = true;
    if (this.brandguidelinesForm.invalid) {
      this.isInvalid = true;
      return;
    }
    this.isInvalid = false;
    this.router.navigate(['/about-your-self']);
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // Check if the Enter key was pressed
    if (event.key === 'Enter') {
      this.onClickbrandGuideLine();
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
