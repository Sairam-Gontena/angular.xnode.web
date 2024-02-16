import { DatePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import _ from 'lodash';
import { AuthApiService } from 'src/app/api/auth.service';
import { CommentsService } from 'src/app/api/comments.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'xnode-create-new-cr-version',
  templateUrl: './create-new-cr-version.component.html',
  styleUrls: ['./create-new-cr-version.component.scss'],
  providers: [DatePipe],

})
export class CreateNewCrVersionComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() header: string = '';
  @Input() versions?: any;
  @Input() selectedCR: any;
  @Output() close = new EventEmitter<any>();

  formGroup: FormGroup | undefined;
  crForm: FormGroup;
  versionForm: FormGroup;
  majorInputValue: any = '';
  minorInputValue: any = '';
  buildInputValue: any = '';
  inputValue: any = '';
  reveiwerList: any = [];
  filteredReveiwers: any;
  suggestions: any;
  product: any;
  currentUser: any;
  crVersion: any = 0;
  priorityList: any = [
    { label: 'High', value: 'HIGH' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Low', value: 'LOW' },
  ];
  reviewersList: any;
  versionList: any = [{ label: 'Add New Version', value: 'ADD_NEW' }];
  isNewVersionAdded: boolean = false;
  showAddVersionForm: boolean = false;
  screenWidth?: number;
  submitted: boolean = false;
  latestVersion: object = { major: 0, minor: 0, build: 0 };
  showClearDueDate: boolean = false;
  isLTwoDisabled: boolean = true;
  minDate!: Date;

  constructor(
    private fb: FormBuilder,
    private commentsService: CommentsService,
    private localStorageService: LocalStorageService,
    private authApiService: AuthApiService,
    private utilsService: UtilsService,
    private specUtils: SpecUtilsService,
    private datePipe: DatePipe,
  ) {
    this.crForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      reason: ['', [Validators.required]],
      version: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      duedate: ['', [Validators.required]],
      seqReview: [''],
      reviewersLOne: [[], [Validators.required]],
    });
    this.versionForm = this.fb.group({
      major: ['2311', [Validators.required, Validators.pattern(/^[.\d]+$/)]],
      minor: ['0', [Validators.required, Validators.pattern(/^[.\d]+$/)]],
      build: ['0', [Validators.required]],
    });
    this.minDate = new Date();
  }

  handleClick(event: any) {
    this.crForm.patchValue({ reviewersLOne: [..._.uniq(this.crForm.value.reviewersLOne)] });
  }

  get crFormControl() {
    return this.crForm.controls;
  }
  get versionFormControl() {
    return this.versionForm.controls;
  }
  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.utilsService.loadSpinner(true);
    this.product = this.localStorageService.getItem(StorageKeys.Product);
    this.currentUser = this.localStorageService.getItem(
      StorageKeys.CurrentUser
    );
    this.getUserByAccountId();
    this.selectedCR = this.header === 'Add New CR' ? '' : this.selectedCR;
    if (this.selectedCR && this.header == 'Edit CR') {
      this.updateCRForm();
    }
  }

  updateCRForm() {
    this.crForm.patchValue({
      title: this.selectedCR.title,
      description: this.selectedCR.description,
      reason: this.selectedCR.reason,
      priority: this.selectedCR.priority,
      duedate: new Date(this.selectedCR.duedate),
      reviewersLOne: this.selectedCR.reviewers.reviewers[0].users,
    });
    this.versionForm.patchValue({
      major: this.selectedCR.version.productVersion.major,
      minor: this.selectedCR.version.productVersion.minor,
      build: this.selectedCR.version.productVersion.build,
    });
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
      productId: this.product?.id,
    };
    this.utilsService.loadSpinner(true);
    this.commentsService
      .getVersions(body)
      .then((response: any) => {
        if (response.status == 200) {
          response.data.forEach((element: any, index: any) => {
            if (index === 0) {
              this.latestVersion = {
                major: element.major,
                minor: element.minor,
                build: element.build,
              };
            }
            this.versionList.push({
              label: element.major + '.' + element.minor + '.' + element.build,
              value: element.id,
            });
          });
          if (this.isNewVersionAdded) {
            this.crForm.patchValue({ version: this.versionList[1].value });
            this.isNewVersionAdded = false;
            this.utilsService.loadSpinner(false);
          } else {
            this.utilsService.loadSpinner(false);
          }
          if (this.selectedCR && this.header == 'Edit CR') {
            this.crForm.patchValue({ version: this.selectedCR.versionId });
          }
        } else {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response?.data?.common?.status,
          });
          this.utilsService.loadSpinner(false);
        }
      })
      .catch((err) => {
        this.utilsService.toggleTaskAssign(false);
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }

  save(event: Event): void {
    this.submitted = true;
    if (this.crForm.invalid) {
      console.log('Invalid form. Please check the form for errors.');
      return;
    }
    this.utilsService.loadSpinner(true);
    this.saveValue();
  }
  onSubmit(event: any) { }

  closePopup() {
    this.visible = false;
    this.close.emit(false);
  }

  newVersionClosePopup(val: any) {
    this.showAddVersionForm = false;
  }
  onSaveNewVersion(val: any) {
    this.isNewVersionAdded = true;
    this.showAddVersionForm = false;
    this.getAllVersions();
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
    return {
      reviewers: [
        {
          level: 'L1',
          users: this.crForm.value.reviewersLOne.map((obj: any) => {
            if (obj.userId) {
              return obj.userId;
            }
            if (obj.user_id) {
              return obj.user_id;
            }
          }),
        },
      ],
    };
  }

  saveValue() {
    let body: any;
    body = {
      author: this.currentUser.user_id,
      title: this.crForm.value.title,
      description: this.crForm.value.description,
      status: 'DRAFT',
      reason: this.crForm.value.reason,
      reviewers: this.getMeReviewerIds(),
      versionId: this.crForm.value.version,
      productId: this.product.id,
      priority: this.crForm.value.priority,
      duedate: this.crForm.value.duedate,
      baseVersionId: null,
      accountId: this.currentUser.account_id,
    };
    if (this.selectedCR && this.header == 'Edit CR') {
      body = {
        id: this.selectedCR.id,
        author: this.currentUser.user_id,
        baseVersionId: this.selectedCR.baseVersionId,
        title: this.crForm.value.title,
        description: this.crForm.value.description,
        status: this.selectedCR.status,
        reason: this.crForm.value.reason,
        reviewers: this.getMeReviewerIds(),
        versionId: this.crForm.value.version,
        productId: this.product.id,
        accountId: this.currentUser.account_id,
        priority: this.crForm.value.priority,
        duedate: this.crForm.value.duedate,
      };
    }
    let specData: any[] | undefined = this.localStorageService.getItem(
      StorageKeys.SPEC_DATA
    );
    if (specData) {
      body.baseVersionId = specData[0].versionId;
    } else {
      console.log('specData is empty or undefined');
    }
    this.commentsService
      .createCr(body)
      .then((response: any) => {
        if (response.statusText === 'Created') {
          this.utilsService.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail: 'Change Request created successfully',
          });
          this.close.emit(response.data);
        } else {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response?.data?.common?.status,
          });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((err) => {
        this.utilsService.toggleTaskAssign(false);
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }

  filteredReveiwer(event: AutoCompleteCompleteEvent, reviewerType: string) {
    let filtered: any[] = [];
    let query = event.query;

    const selectedReviewers = this.crForm.value.reviewersLOne.map(
      (reviewer: any) => reviewer.name.toLowerCase()
    );
    filtered = this.reveiwerList.filter(
      (reviewer: any) =>
        reviewer.name.toLowerCase().indexOf(query.toLowerCase()) === 0 &&
        !selectedReviewers.includes(reviewer.name.toLowerCase())
    );
    this.filteredReveiwers = _.uniq(filtered);
  }
  search(event: AutoCompleteCompleteEvent) {
    this.suggestions = [...Array(10).keys()].map(
      (item) => event.query + '-' + item
    );
  }

  reduceToInitials(fullName: string): string {
    const nameParts = fullName?.split(' ');
    const initials = nameParts?.map((part) => part.charAt(0));
    const reducedName = initials?.join('').toUpperCase();
    return reducedName;
  }

  getUserByAccountId(): void {
    this.authApiService
      .getAllUsers(this.currentUser?.account_id)
      .then((response: any) => {
        if (response.status === 200 && response?.data) {
          response.data.forEach((element: any) => {
            element.name = element.first_name + ' ' + element.last_name;
          });
          this.reveiwerList = response.data;
          this.getAllVersions();
        } else {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response.data.detail,
          });
          this.utilsService.loadSpinner(false);
        }
      })
      .catch((err: any) => {
        this.utilsService.loadSpinner(false);
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }

  onDateSelect(event: any) {
    if (this.crForm.value.duedate) {
      this.showClearDueDate = true;
    } else {
      this.showClearDueDate = true;
    }
  }
}
