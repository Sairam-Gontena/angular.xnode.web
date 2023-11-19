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
  @Output() updateLatestVersion = new EventEmitter<string>();
  formGroup: FormGroup | undefined;
  crForm: FormGroup;
  versionform: FormGroup;
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
  newVersion: boolean = false;
  showAddVersionForm: boolean = false;

  constructor(private fb: FormBuilder,
    private commentsService: CommentsService,
    private localStorageService: LocalStorageService,
    private authApiService: AuthApiService,
    private utilsService: UtilsService) {
    this.crForm = this.fb.group({
      title: ['', [Validators.required]],
      cr: ['', [Validators.required]],
      description: ['', [Validators.required]],
      reason: ['', [Validators.required]],
      version: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      seqReview: ['', [Validators.required]],
    });
    this.versionform = this.fb.group({
      major: ['2311', [Validators.required]],
      minor: ['0', [Validators.required]],
      build: ['0', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.utilsService.loadSpinner(true)
    this.product = this.localStorageService.getItem(StorageKeys.Product);
    this.currentUser = this.localStorageService.getItem(StorageKeys.CurrentUser);
    this.getUserByAccountId();
  }

  onDropdownChange(event: any): void {
    this.showAddVersionForm = event === 'ADD_NEW';
  }


  getAllVersions() {
    let body = {
      "productId": this.product.id
    }
    this.commentsService.getVersions(body).then((response: any) => {
      if (response.status == 200) {
        response.data.forEach((element: any) => {
          this.versionList.push({ label: element.major + '.' + element.minor + '.' + element.build, value: element.id })
        });
        if (this.newVersion) {
          this.crForm.patchValue({ version: this.newVersion });
          this.newVersion = false;
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

  save(event?: any): void {
    console.log('event');
    console.log('form', this.crForm);
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

  saveValue() {
    let body = {
      "author": this.currentUser.user_id,
      "title": this.crForm.value.title,
      "description": this.crForm.value.description,
      "status": 'DRAFT',
      "reason": this.crForm.value.reason,
      "reviewers": [],
      "versionId": this.crForm.value.version,
      "productId": this.product.id,
      "priority": this.crForm.value.priority,
      "duedate": this.crForm.value.duedate,
    }
    this.commentsService.createCr(body).then((response: any) => {
      if (response.statusText === 'Created') {
        this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'Version added successfully' });
        // this.close.emit(response.data)
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

  saveVersion(): void {
    this.showAddVersionForm = false;

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
