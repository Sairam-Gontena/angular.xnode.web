import { Component, Input, OnInit } from '@angular/core';
import { isArray } from 'lodash';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { LocalStorageService } from '../components/services/local-storage.service';
import { MessagingService } from '../components/services/messaging.service';
import { MessageTypes } from 'src/models/message-types.enum';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  items: MenuItem[] | undefined;
  @Input() comment: any;
  @Input() showCrPopup: boolean = false;
  specData: any;
  prSpecsTitle: string = "";
  crForm!: FormGroup;
  priorityList: any = [{ name: 'High' }, { name: 'Medium' }, { name: 'Low' }];
  versionList: any = [{ name: 'Add New Version' }, { name: 'High' }, { name: 'Medium' }, { name: 'Low' }];
  selectedReviewers: any;
  suggestions?: any[];
  reviewers?: any[];
  showNewCrPopup: boolean = false

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



  constructor(private fb: FormBuilder, private localStorageService: LocalStorageService, private messagingService: MessagingService) {
    this.crForm = this.fb.group({
      priority: ['', [Validators.required]],
      version: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      crToAdd: ['', [Validators.required]],
      seqReview: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.items = [{ label: 'Functional Specifications' }, { label: '3.1 User roles' }];
    this.messagingService.getMessage<any>().subscribe(msg => {
      if (msg.msgType === MessageTypes.LinkToCR) {
        if (this.comment) {
          this.specData = this.localStorageService.getItem(StorageKeys.SpecData);
          this.getSpecsTitle();
        }
      }
    });
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

  getSpecsTitle() {
    const currentSpec = this.specData.find((m: any) => m.id === this.comment.topParentId);
    if (currentSpec && isArray(currentSpec.content) && currentSpec.content.length > 0) {
      const titles = this.getBreadcrumbTitles(currentSpec.content, this.comment.parentId);
      if (titles) {
        this.prSpecsTitle = titles.join(" > ");
      }
    }
    else {
      this.prSpecsTitle = currentSpec.title;
    }
  }

  getBreadcrumbTitles(specs: any, parentId: string): string[] | null {
    for (const item of specs) {
      if (item.id === this.comment.parentId) {
        return [item.title];
      }
      const subBreadcrumb = this.getBreadcrumbTitles(item.content, parentId);
      if (subBreadcrumb !== null) {
        return [item.title, ...subBreadcrumb];
      }
    }
    return null;
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
    if (event.value.name === 'Add New Version') {
      this.showNewCrPopup = true
    }
  }
  closeNewCrPopup(event: boolean) {
    if (event == false) {
      this.showNewCrPopup = false
    }
  }

}
