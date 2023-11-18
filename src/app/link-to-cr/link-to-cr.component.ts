import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { isArray } from 'lodash';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { LocalStorageService } from '../components/services/local-storage.service';
import { MessagingService } from '../components/services/messaging.service';
import { MessageTypes } from 'src/models/message-types.enum';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from 'src/app/api/comments.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { Dropdown } from 'primeng/dropdown';
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
  items: MenuItem[] | undefined;
  @Input() comment: any;
  @Output() close = new EventEmitter<any>();
  @Input() showCrPopup: boolean = false;
  specData: any;
  product: any;
  prSpecsTitle: string = "";
  crForm!: FormGroup;
  priorityList: any = [{ name: 'High' }, { name: 'Medium' }, { name: 'Low' }];
  versionList: any = [{ label: 'Add New Version', value: 'ADD_NEW' }];
  selectedReviewers: any;
  suggestions?: any[];
  reviewers?: any[];
  showNewCrPopup: boolean = false;
  isTheNewVersionCreated: boolean = false;
  latestVersion: any;
  reveiwerList: any = [{ name: 'Afghanistan', code: 'AF' },
  { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' },
  { name: 'American Samoa', code: 'AS' },
  { name: 'Andorra', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'nAlbania', code: 'AL' },
  { name: 'nAlgeria', code: 'DZ' },
  { name: 'nAmerican Samoa', code: 'AS' },
  { name: 'nAndorra', code: 'AD' },
  { name: 'nAngola', code: 'AO' },
  ]

  formGroup: FormGroup | undefined;

  filteredReveiwers: any;



  constructor(private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private messagingService: MessagingService,
    private commentsService: CommentsService,
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
    this.product = this.localStorageService.getItem(StorageKeys.Product)
    this.items = [{ label: 'Functional Specifications' }, { label: '3.1 User roles' }];
    this.messagingService.getMessage<any>().subscribe(msg => {
      if (msg.msgType === MessageTypes.LinkToCR) {
        if (this.comment) {
          this.specData = this.localStorageService.getItem(StorageKeys.SpecData);
        }
      }
    });
    this.getAllVersions();
  }

  getAllVersions() {
    let body = {
      "productId": this.product.id
    }
    this.commentsService.getVersions(body).then((response: any) => {
      if (response.status == 200) {
        console.log(response.data);
        response.data.forEach((element: any) => {
          this.versionList.push({ label: element.major + '.' + element.minor + '.' + element.build, value: element.id })
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
      console.log(this.versionList, 'this.versionList');
    }
  }

  closePopUp(event: any) {
    if (event.id) {
      this.getAllVersions();
    }
    this.showNewCrPopup = false;
    this.crForm.patchValue({ version: '' });
    console.log('this.crForm', this.crForm);

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
