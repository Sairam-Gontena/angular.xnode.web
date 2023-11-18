import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from 'src/app/api/comments.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-create-new-cr-version',
  templateUrl: './create-new-cr-version.component.html',
  styleUrls: ['./create-new-cr-version.component.scss']
})

export class CreateNewCrVersionComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() header: string = '';
  @Input() versions?: any;
  @Output() close = new EventEmitter<any>();
  @Output() updateLatestVersion = new EventEmitter<string>();
  formGroup: FormGroup | undefined;
  versionForm!: FormGroup;
  majorInputValue: any = '';
  minorInputValue: any = '';
  buildInputValue: any = '';
  inputValue: any = '';
  product: any;
  currentUser: any;

  constructor(private fb: FormBuilder,
    private commentsService: CommentsService,
    private localStorageService: LocalStorageService,
    private utilsService: UtilsService) {
    this.versionForm = this.fb.group({
      major: ['2311', [Validators.required]],
      minor: ['0', [Validators.required]],
      build: ['0', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.product = this.localStorageService.getItem(StorageKeys.Product);
    this.currentUser = this.localStorageService.getItem(StorageKeys.CurrentUser);
    console.log('versions', this.versions);
    if (this.versions.length >= 2) {
      let numbers = this.versions[1].split('.');
      console.log('numbers', numbers);

      this.versionForm.patchValue({ major: parseFloat(numbers[0]) });
      this.versionForm.patchValue({ minor: parseFloat(numbers[0]) });
      this.versionForm.patchValue({ build: parseFloat(numbers[0]) });
    }

  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (this.header == 'Add New Version' && (this.version == null || this.version == undefined)) {
  //     const currentDate = new Date();
  //     const year = currentDate.getFullYear() % 100; // Get the last two digits of the year
  //     const month = currentDate.getMonth() + 1; // Month is zero-based, so add 1
  //     let version = this.formatNumber(year) + this.formatNumber(month) + '.0.0'
  //     let versionParts = version.split('.');
  //     this.majorInputValue = versionParts[0];
  //     this.minorInputValue = versionParts[1];
  //     this.buildInputValue = versionParts[2];
  //   }

  //   if (this.version) {
  //     let newVersion = this.incrementString(this.version);
  //     let versionParts = newVersion.split('.');
  //     this.majorInputValue = versionParts[0];
  //     this.minorInputValue = versionParts[1];
  //     this.buildInputValue = versionParts[2];
  //   }
  // }

  private formatNumber(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  save(event: any): void {
    // if (this.inputValue && this.version) {
    //   let firstString = this.inputValue.match(/^[^.]+/);
    //   let secondString = this.version.match(/^[^.]+/);
    //   let firstResult = firstString ? firstString[0] : null;
    //   let secondResult = secondString ? secondString[0] : null;
    //   if (firstResult != secondResult) {
    //     this.inputValue = firstResult + '.0.0';
    //   }
    // }
    this.saveValue()
  }

  closePopup() {
    this.visible = false;
    this.close.emit(false);
  }

  incrementString(inputString: any) {
    let segments = inputString.split('.');
    let carry = 1;
    for (let i = segments.length - 1; i >= 0; i--) {
      let segmentValue = parseInt(segments[i]) + carry;
      if (i > 0) {
        segments[i] = (segmentValue % 10).toString();
      } else {
        segments[i] = segmentValue.toString().padStart(4, '0');
      }
      carry = Math.floor(segmentValue / 10);
      if (carry === 0) {
        break;
      }
    }
    let result = segments.join('.');
    return result;
  }

  saveValue() {
    this.utilsService.loadSpinner(true);
    let body = {
      "productId": this.product.id,
      "major": this.majorInputValue,
      "minor": this.minorInputValue,
      "build": this.buildInputValue,
      "notes": {},
      "attachments": [],
      "createdBy": this.currentUser.user_id
    }
    this.commentsService.addVersion(body).then((response: any) => {
      if (response.statusText === 'Created') {
        console.log('response', response);

        this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'Version added successfully' });
        this.closePopup()
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.common?.status });
      }
      this.utilsService.loadSpinner(false);
    }).catch(err => {
      this.utilsService.toggleTaskAssign(false);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }

}
