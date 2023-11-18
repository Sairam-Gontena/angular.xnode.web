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
  versionForm: FormGroup;
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
    if (this.versions?.length >= 2) {
      let numbers = this.versions[1].label.split('.');
      this.versionForm.patchValue({ major: parseFloat(numbers[0]) });
      this.versionForm.patchValue({ minor: parseFloat(numbers[1]) });
      this.versionForm.patchValue({ build: parseFloat(numbers[2]) + 1 });
    }
  }

  save(event?: any): void {
    this.saveValue()
  }

  onSubmit(event: any) {
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
      "major": this.versionForm.value.major,
      "minor": this.versionForm.value.minor,
      "build": this.versionForm.value.build,
      "notes": {},
      "attachments": [],
      "createdBy": this.currentUser.user_id
    }
    this.commentsService.addVersion(body).then((response: any) => {
      if (response.statusText === 'Created') {
        this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'Version added successfully' });
        this.close.emit(response.data)
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
