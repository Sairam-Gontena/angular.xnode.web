import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthApiService } from 'src/app/api/auth.service';
import { CommentsService } from 'src/app/api/comments.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
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
  formGroup: FormGroup | undefined;
  crForm: FormGroup;
  versionForm: FormGroup;
  majorInputValue: any = '';
  minorInputValue: any = '';
  buildInputValue: any = '';
  inputValue: any = '';
  reveiwerList: any = []
  filteredReveiwers: any;
  suggestions: any;
  product: any;
  currentUser: any;
  crVersion: any = 0;
  priorityList: any = [{ label: 'High', value: 'HIGH' }, { label: 'Medium', value: 'MEDIUM' }, { label: 'Low', value: 'LOW' }];
  versionList: any = [{ label: 'Add New Version', value: 'ADD_NEW' }];
  isNewVersionAdded: boolean = false;
  showAddVersionForm: boolean = false;
  screenWidth?: number
  submitted: boolean = false;

  constructor(private fb: FormBuilder,
    private commentsService: CommentsService,
    private localStorageService: LocalStorageService,
    private authApiService: AuthApiService,
    private utilsService: UtilsService) {
    this.crForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      reason: ['', [Validators.required]],
      version: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      duedate: ['', [Validators.required]],
      seqReview: [''],
      reviewersLOne: [[], [Validators.required]],
      reviewersLTwo: [[], [Validators.required]],
    });
    this.versionForm = this.fb.group({
      major: ['2311', [Validators.required, Validators.pattern(/^[.\d]+$/)]],
      minor: ['0', [Validators.required, Validators.pattern(/^[.\d]+$/)]],
      build: ['0', [Validators.required]],
    });
  }
  get crFormControl() {
    return this.crForm.controls;
  }
  get versionFormControl() {
    return this.versionForm.controls;
  }
  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.utilsService.loadSpinner(true)
    this.product = this.localStorageService.getItem(StorageKeys.Product);
    this.currentUser = this.localStorageService.getItem(StorageKeys.CurrentUser);
    this.getUserByAccountId();
  }

  onMajorInputChange(event: Event) {
    this.versionForm.get('minor')!.setValue('0');
    this.versionForm.get('build')!.setValue('0');
  }

  onMinorInputChange(event: Event) {
    this.versionForm.get('build')!.setValue('0');
  }

  onDropdownChange(event: any): void {
    this.showAddVersionForm = event === 'ADD_NEW';
  }


  getAllVersions() {
    this.versionList = [{ label: 'Add New Version', value: 'ADD_NEW' }];
    let body = {
      "productId": this.product?.id
    }
    this.commentsService.getVersions(body).then((response: any) => {
      if (response.status == 200) {
        response.data.forEach((element: any, index: any) => {
          if (index === 0) {
            this.versionForm.patchValue({ build: element.build + 1 })
            this.versionForm.patchValue({ major: element.major });
            this.versionForm.patchValue({ minor: element.minor });
          }
          this.versionList.push({ label: element.major + '.' + element.minor + '.' + element.build, value: element.id })
        });
        if (this.isNewVersionAdded) {
          this.crForm.patchValue({ version: this.versionList[1].value });
          this.isNewVersionAdded = false;
        }
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.common?.status });
      }
      this.utilsService.loadSpinner(false);
    }).catch(err => {
      this.utilsService.toggleTaskAssign(false);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }

  save(event: Event): void {
    this.submitted = true;
    if (this.crForm.invalid) {
      console.log("Invalid form. Please check the form for errors.");
      return;
    }
    this.utilsService.loadSpinner(true);
    this.saveValue();
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

  getMeReviewerIds() {
    return this.crForm.value.reviewersLOne.concat(this.crForm.value.reviewersLTwo).map((obj: any) => obj.user_id);
  }

  saveValue() {
    let body = {
      "author": this.currentUser.user_id,
      "title": this.crForm.value.title,
      "description": this.crForm.value.description,
      "status": 'DRAFT',
      "reason": this.crForm.value.reason,
      "reviewers": this.getMeReviewerIds(),
      "versionId": this.crForm.value.version,
      "productId": this.product.id,
      "priority": this.crForm.value.priority,
      "duedate": this.crForm.value.duedate,
    }
    this.commentsService.createCr(body).then((response: any) => {
      if (response.statusText === 'Created') {
        this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'Change Request created successfully' });
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

  filteredReveiwer(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.reveiwerList as any[]).length; i++) {
      let reveiwer = (this.reveiwerList as any[])[i];
      if (reveiwer.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(reveiwer);
      }
    }
    this.filteredReveiwers = filtered;
  }

  search(event: AutoCompleteCompleteEvent) {
    this.suggestions = [...Array(10).keys()].map(item => event.query + '-' + item);
  }

  reduceToInitials(fullName: string): string {
    const nameParts = fullName.split(' ');
    const initials = nameParts.map(part => part.charAt(0));
    const reducedName = initials.join('');
    return reducedName;
  }

  saveVersion(event: Event) {
    this.submitted = true;
    if (this.versionForm.invalid) {
      return;
    }
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
        this.showAddVersionForm = false;
        this.isNewVersionAdded = true;
        this.versionForm.reset();
        this.getAllVersions();
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.common?.status });
      }
      this.utilsService.loadSpinner(false);
    }).catch(err => {
      this.utilsService.toggleTaskAssign(false);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
    event.stopPropagation();
  }

  getUserByAccountId(): void {
    this.authApiService.getAllUsers('user/get_all_users?account_id=' + this.currentUser?.account_id).then((response: any) => {
      if (response.status === 200 && response?.data) {
        response.data.forEach((element: any) => {
          element.name = element.first_name + " " + element.last_name;
        });
        this.reveiwerList = response.data;
        this.getAllVersions();
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
        this.utilsService.loadSpinner(false);
      }
    }).catch((err: any) => {
      this.utilsService.loadSpinner(false);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }

}
