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
    console.log('comment', this.comment);
    this.getMeCrList();
  }

  getMeCrList() {
    let body = {
      "productId": this.product.id
    }
    this.commentsService.getChangeRequestList(body).then((response: any) => {
      if (response.status == 200 && response.data) {
        response.data.forEach((element: any) => {
          element.label = element.crId + "-" + element.description;
          element.value = element.id
        });
        this.crList = this.crList.concat(response.data);
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.common?.status });
      }
      this.utilsService.loadSpinner(false);
    }).catch(err => {
      this.utilsService.toggleTaskAssign(false);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }


  onDropdownChange(event: any): void {
    if (event === 'ADD_NEW') {
      this.showNewCrPopup = true;
    } else {
      this.crList.forEach((cr: any) => {
        console.log('cr.id', cr);
        console.log('event', event);


        if (cr.value === event) {
          console.log('cr', cr, event);

          this.crForm.patchValue({ 'priority': cr.priority, version: cr.versionId, dueDate: cr.dueDate })
        }
      })
      console.log(' this.crForm', this.crForm.value);

    }

  }

  closePopUp(event: any) {
    this.getMeCrList();
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
