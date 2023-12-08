import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { forEach, isArray } from 'lodash';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { LocalStorageService } from '../components/services/local-storage.service';
import { MessagingService } from '../components/services/messaging.service';
import { MessageTypes } from 'src/models/message-types.enum';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from 'src/app/api/comments.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { Dropdown } from 'primeng/dropdown';
import { AuthApiService } from '../api/auth.service';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';


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
  @Input() entityType?= '';
  items: MenuItem[] | undefined;
  specData: any;
  product: any;
  prSpecsTitle: string = "";
  crForm!: FormGroup;
  priorityList: any = [{ label: 'High', value: 'HIGH' }, { label: 'Medium', value: 'MEDIUM' }, { label: 'Low', value: 'LOW' }];
  versionList: any = [];
  crList: any = [{ label: 'New Change Request', value: 'ADD_NEW' }]
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
  reviewerList: any = [];
  submitted: boolean = false;
  isNewCrCreated: boolean = false;
  constructor(private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private messagingService: MessagingService,
    private commentsService: CommentsService,
    private utilsService: UtilsService,private specUtils:SpecUtilsService) {
    this.crForm = this.fb.group({
      priority: new FormControl({ value: '', disabled: true }, Validators.required),
      version: new FormControl({ value: '', disabled: true }, Validators.required),
      duedate: new FormControl({ value: '', disabled: true }, Validators.required),
      crToAdd: new FormControl({ value: null, disabled: false }, Validators.required),
    });
  }

  ngOnInit() {
    this.utilsService.loadSpinner(true);
    this.product = this.localStorageService.getItem(StorageKeys.Product);
    this.currentUser = this.localStorageService.getItem(StorageKeys.CurrentUser);
    this.items = [{ label: this.comment?.referenceContent?.specTitle }, { label: this.comment?.referenceContent?.title }];
    this.messagingService.getMessage<any>().subscribe((msg: any) => {
      if (msg.msgType === MessageTypes.LinkToCR) {
        if (this.comment) {
          this.specData = this.localStorageService.getItem(StorageKeys.SpecData);
        }
      }
    });
    this.getMeCrList();
  }
  get crFormControl() {
    return this.crForm.controls;
  }
  getAllVersions() {
    let body = {
      "productId": this.product?.id
    }
    this.commentsService.getVersions(body).then((response: any) => {
      if (response.status == 200) {
        response.data.forEach((element: any) => {
          this.versionList.push({ label: element.version, value: element.id })
        });
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.common?.status });
      }
      this.utilsService.loadSpinner(false);
    }).catch(err => {
      this.utilsService.toggleTaskAssign(false);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }

  getMeCrList() {
    let body = {
      "productId": this.product?.id,
      "status": 'DRAFT'
    }
    this.commentsService.getChangeRequestList(body).then((response: any) => {
      console.log(response, '000000000');
      if (response.status == 200 && response.data) {
        response.data.forEach((element: any) => {
          element.label = element.crId;
          element.value = element.id;
        });
        this.crList = this.crList.concat(response.data);
        if (this.isNewCrCreated) {
          this.crForm.patchValue({ 'crToAdd': this.crList[1] });
          this.isNewCrCreated = false;
        }
        this.getAllVersions();
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.common?.status });
        this.utilsService.loadSpinner(false);
      }
    }).catch(err => {
      this.utilsService.toggleTaskAssign(false);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }


  onDropdownChange(event: any): void {
    if (event.value === 'ADD_NEW') {
      this.showNewCrPopup = true;
    } else if (event?.value !== '' && event?.value !== 'ADD_NEW') {
      this.crForm.patchValue({ priority: this.priorityList.filter((obj: any) => { return obj.value === event.priority })[0], version: this.versionList.filter((obj: any) => { return obj.value === event.versionId })[0], duedate: new Date(event.duedate) })
      this.reviewerList = event.reviewers
    }
  }

  closePopUp(event: any) {
    if (event.id) {
      this.isNewCrCreated = true;
    }
    this.showNewCrPopup = false;
    this.crList = [{ label: 'New Change Request', value: 'ADD_NEW' }];
    this.getMeCrList();
  }


  onSubmit(event: any): void {
    this.close.emit(false)
  }

  linkCr(): void {
    this.submitted = true;
    if (this.crForm.invalid) {
      return;
    }
    this.utilsService.loadSpinner(true);
    const body = {
      "crId": this.crForm.value.crToAdd.id,
      "entityType": this.entityType,
      "entityId": this.comment.id,
    }
    this.commentsService.linkCr(body).then((response: any) => {
      if (response) {
        this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'CR has been successfully linked' });
        this.specUtils._commentsCrActiveTab(true);
        this.close.emit();
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.common?.status });
      }
      this.utilsService.loadSpinner(false);
    }).catch(err => {
      this.utilsService.toggleTaskAssign(false);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }
  setAvatar(userObj: any): string {
    return userObj.firstName.charAt(0).toUpperCase() + userObj.lastName.charAt(0).toUpperCase();;
  }
}
