import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Table } from 'primeng/table';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { LocalStorageService } from '../../services/local-storage.service';
import { CommonUtilsService } from '../../services/common-utils.service';
import { UtilsService } from '../../services/utils.service';
import _ from 'lodash';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-content-grid',
  templateUrl: './content-grid.component.html',
  styleUrls: ['./content-grid.component.scss']
})
export class ContentGridComponent implements OnChanges {
  @Input() showFilterColumns?: boolean = false;
  @Input() clearAllTheSelectedConversations?: boolean;
  @Input() headers?: any[];
  @Input() dataContent?: any;
  @Input() isCheckbox?: boolean = false;
  @Input() entity: any;
  @Input() showSearch?: boolean = false;
  @Input() selectedLeftPanelConversation: any;
  @Input() selectedConversationData?: any;
  @Input() selectedTab: any;
  @Input() enablePagination: boolean = true;
  @Output() idClicked = new EventEmitter();
  @Output() onRowSelected = new EventEmitter();
  @Output() onRowUnselected = new EventEmitter();
  @Output() summarize = new EventEmitter();
  @Output() summarizeBanner = new EventEmitter();
  @Output() emitCheckedRecords: EventEmitter<any> = new EventEmitter();
  @Output() emitTrue = new EventEmitter();
  @Output() clickedLinkToCR: EventEmitter<any> = new EventEmitter<any>();
  @Output() linkConversation: EventEmitter<any> = new EventEmitter<any>();
  // @Output() allSelectedConversations: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('dt1') dt1: Table | undefined;
  @Input() currentUser?: any;
  @Output() followUnfollow = new EventEmitter();
  @Input() tableFilterEvent: any;
  @Input()
  set newStatus(value: any) {
    this.status = value;
  }

  selectedConversations: any = [];
  selectedResources: any;
  status: any;
  selectedItems: any = [];
  globalFilterFields: any = [];
  selectedMainConversation: any;
  conversations: any = [];
  localDateFormat: string = "MM/dd/yyyy";
  get newStatus(): any {
    return this.status;
  }

  constructor(private commonUtils: CommonUtilsService,
    private utils: UtilsService,
    private storageService: LocalStorageService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.headers?.forEach((elem: any) => {
      this.globalFilterFields.push(elem.field)
    });
    this.localDateFormat = this.utils.getDateFormat();
  }

  linkto() {
    this.linkConversation.emit(true)
  }

  populateItems(data: any, event: any) {
    this.emitCheckedRecords.emit({ data, event })
  }

  onHeaderCheckboxToggle(event: any) {
    if (this.selectedConversations.length > 0) {
      this.onRowSelected.emit(this.selectedConversations);
    } else {
      this.onRowUnselected.emit(this.selectedConversations);
    }
  }

  detailsView(data: any) {
    this.idClicked.emit(data)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['entity']?.currentValue) {
      this.entity = changes['entity']?.currentValue;
    }
    if (changes['dataContent']?.currentValue) {
      this.dataContent = changes['dataContent']?.currentValue;
      this.selectedConversations = this.dataContent.filter((conv: any) => conv.checked || conv.selectedconversation);
      this.selectedMainConversation = this.dataContent.filter((conv: any) => conv.selectedconversation)?.[0];
    }
    if (changes['selectedLeftPanelConversation']?.currentValue) {
      this.selectedLeftPanelConversation = changes['selectedLeftPanelConversation']?.currentValue;
      this.selectedItems = this.selectedLeftPanelConversation.references;
    }
    if (changes['tableFilterEvent']?.currentValue) {
      this.applyFilterGlobal(this.tableFilterEvent, 'contains')
    }
    if (changes['clearAllTheSelectedConversations']?.currentValue) {
      this.clearRowsSelection();
    }
    if (changes['selectedConversationData']?.currentValue) {
      this.selectedConversations = changes['selectedConversationData']?.currentValue;
      if (this.selectedConversations && this.selectedConversations.length) {
        this.onRowSelected.emit(this.selectedConversations);
      }
    }
  }

  changeCheckbox(event: any) {
    if (this.entity == 'Conversations') {
      if (!_.find(event, { selectedconversation: true })) {
        event.push(this.selectedMainConversation);
        this.selectedConversations.push(this.selectedMainConversation)
      }
      let list: any[] = [];
      let unsummarizedList: any[] = [];
      event.forEach((element: any) => {
        if (element.isSummarized || element.selectedconversation) {
          list.push(element);
          this.summarizeBanner.emit({ show: false, data: element });
        } else {
          unsummarizedList.push(element)
          if (unsummarizedList.length == 1)
            this.summarizeBanner.emit({ show: true, data: element });
          if (unsummarizedList.length > 1)
            this.summarizeBanner.emit({ showAll: true, data: element });
        }
      });
      this.selectedConversations = [...list]
      this.cdr.detectChanges();
    }
  }

  isArray(item: any) {
    if (Array.isArray(item)) {
      return true;
    } else {
      return false
    }
  }

  onRowSelect(event: any) {
    this.onRowSelected.emit(this.selectedConversations);
  }

  onRowUnselect(event: any) {
    this.onRowUnselected.emit(this.selectedConversations);
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt1!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  followOrUnfollow(event: any) {
    this.followUnfollow.emit(event);
  }

  getTextColor(status: any) {
    let textColor = '#ffffff';
    if (status)
      textColor = this.commonUtils.getStatusTextColor(status);
    return textColor;
  }

  clearRowsSelection() {
    this.entity == 'Conversations' ? this.selectedConversations = _.filter(this.selectedConversations, { selectedconversation: true }) : this.selectedConversations = [];
    this.onRowSelected.emit(this.selectedConversations);
  }
  getFileExtension(fileName: string): string {
    return fileName.split('.').pop() || '';
  }
  getFileIcon(extension: string): string {
    const normalizedExtension = extension.toLowerCase();
    if (normalizedExtension === 'doc' || normalizedExtension === 'docx') {
      return `../../../assets/images/doc.svg`;
    } else if (normalizedExtension === 'xls' || normalizedExtension === 'xlsx') {
      return `../../../assets/images/xls.svg`;
    } else {
      return '../../../assets/images/' + normalizedExtension + '.svg';
    }
  }

  formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
}
