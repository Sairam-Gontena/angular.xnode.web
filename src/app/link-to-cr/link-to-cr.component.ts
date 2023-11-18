import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { forEach, isArray } from 'lodash';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { LocalStorageService } from '../components/services/local-storage.service';
import { MessagingService } from '../components/services/messaging.service';
import { MessageTypes } from 'src/models/message-types.enum';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from 'src/app/api/comments.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { Dropdown } from 'primeng/dropdown';
import { AuthApiService } from '../api/auth.service';
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'xnode-link-to-cr',
  templateUrl: './link-to-cr.component.html',
  styleUrls: ['./link-to-cr.component.css']
})

export class LinkToCrComponent implements OnInit {
  @ViewChild('dropdown') dropdown?: Dropdown;
  @Input() comment: any;
  @Output() close = new EventEmitter<any>();
  @Input() showCrPopup: boolean = false;
  items: MenuItem[] | undefined;
  specData: any;
  product: any;
  prSpecsTitle: string = "";
  crForm!: FormGroup;
  priorityList: any = [{ label: 'High', value: 'HIGH' }, { label: 'Medium', value: 'MEDIUM' }, { label: 'Low', value: 'LOW' }];
  versionList: any = [{ label: 'Add New Version', value: 'ADD_NEW' }];
  selectedReviewers: any;
  suggestions?: any[];
  reviewers?: any[];
  showNewCrPopup: boolean = false;
  isTheNewVersionCreated: boolean = false;
  latestVersion: any;
  reveiwerList: any;
  newVersion: any;
  formGroup: FormGroup | undefined;
  filteredReveiwers: any;
  currentUser: any;

  constructor(private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private messagingService: MessagingService,
    private commentsService: CommentsService,
    private authApiService: AuthApiService,
    private utilsService: UtilsService) {
    this.crForm = this.fb.group({
      priority: ['', [Validators.required]],
      version: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      crToAdd: ['', [Validators.required]],
      seqReview: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.utilsService.loadSpinner(true);
    this.product = this.localStorageService.getItem(StorageKeys.Product);
    this.currentUser = this.localStorageService.getItem(StorageKeys.CurrentUser);
    this.items = [{ label: 'Functional Specifications' }, { label: '3.1 User roles' }];
    this.messagingService.getMessage<any>().subscribe(msg => {
      if (msg.msgType === MessageTypes.LinkToCR) {
        if (this.comment) {
          this.specData = this.localStorageService.getItem(StorageKeys.SpecData);
        }
      }
    });
    this.getUserByAccountId();
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
          this.newVersion = undefined;
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

  onDropdownChange(event: any): void {
    if (event === 'ADD_NEW') {
      this.showNewCrPopup = true;
    }
  }

  closePopUp(event: any) {
    if (event?.id) {
      this.newVersion = event.major + '.' + event.minor + '.' + event.build;
      this.getAllVersions();
    } else {
      this.crForm.patchValue({ version: '' });
    }
    this.showNewCrPopup = false;
  }

  updateLatestVersion(event: string) {

    this.versionList.shift();
    this.versionList.unshift({ version: event })
    this.versionList.unshift({ version: 'Add New Version' })
  }

  onSubmit(event: any): void {
    this.close.emit(false)
  }

}
