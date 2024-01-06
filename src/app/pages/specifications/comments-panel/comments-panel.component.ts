import {
  Component,
  Input,
  OnInit,
  SimpleChange,
  ViewChild,
} from '@angular/core';
import { UtilsService } from '../../../components/services/utils.service';
import { ApiService } from 'src/app/api/api.service';
import { CommentsService } from 'src/app/api/comments.service';
import { DropdownOptions } from 'src/models/dropdownOptions';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'xnode-comments-panel',
  templateUrl: './comments-panel.component.html',
  styleUrls: ['./comments-panel.component.scss'],
})
export class CommentsPanelComponent implements OnInit {
  @Input() specData?: Array<[]>;
  @Input() usersList: any;
  @Input() list: any;
  @Input() activeIndex: any;
  @Input() swaggerData: any;
  showInput = false;
  filter: any;
  searchIconKeyword: string = '';
  selectedUsers: any = [];
  filterOptions: Array<DropdownOptions> = [
    { label: 'All', value: 'ALL' },
    { label: 'Linked', value: 'LINKED' },
    { label: 'New', value: 'NEW' },
    { label: 'Closed', value: 'CLOSED' },
  ];
  selectedFilter: { label: string; value: string } = {
    label: 'All',
    value: 'ALL',
  };
  selectedComment: any;
  filteredList: any = [];
  product: any;
  searchUpdated: Subject<string> = new Subject<string>();
  selectedUserNames: any = [];

  constructor(
    private utils: UtilsService,
    private specUtils: SpecUtilsService,
    private commentsService: CommentsService,
    private storageService: LocalStorageService,
    private apiService: ApiService
  ) {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.searchUpdated.pipe(debounceTime(1000)).subscribe((search) => {
      this.specUtils.sendCommentSearchByKeywordListData(this.selectedUsers);
    });
  }

  changeSearchIconColor(entity: any) {
    this.filter = entity;
  }

  userFilter() {
    this.specUtils.sendCommentSearchByUsersListData(this.selectedUsers);
  }

  searchConversation() {
    this.searchUpdated.next(this.searchIconKeyword);
  }

  ngOnInit(): void {
    console.log('list', this.list);
    this.filterList();
    // if (this.specUtils.specConversationPanelFrom == 'spec_header') {
    //   let spec_version = localStorage.getItem('SPEC_VERISON');
    //   if (spec_version) {
    //     let data = JSON.parse(spec_version);
    //     let id;
    //     data.id ? id = data.id : id = data.versionId;
    //     this.utils.loadSpinner(true);
    //     this.apiService.getComments('comment/comments-by-productId?productId=' + data.productId + '&verisonId=' + id).then((res: any) => {
    //       if (res.status === 200 && res.data) {
    //         this.list = res.data;
    //         this.filterList(res.data);
    //       }
    //       this.utils.loadSpinner(false);
    //     }).catch((err) => {
    //       console.log(err);
    //       this.utils.loadSpinner(false);
    //     })
    //   }
    // }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['list']?.currentValue) {
      this.filteredList = [];
      this.list = changes['list'].currentValue;
      this.filterList();
    }
  }

  filterList(data?: any): void {
    this.filteredList = [];
    switch (this.selectedFilter.value) {
      case 'LINKED':
        this.filteredList = this.list.filter(
          (item: any) => item.status === 'LINKED'
        );
        break;
      case 'NEW':
        this.filteredList = this.list.filter(
          (item: any) => item.status === 'NEW'
        );
        break;
      case 'CLOSED':
        this.filteredList = this.list.filter(
          (item: any) => item.status === 'CLOSED'
        );
        break;
      default:
        this.filteredList = this.list;
        break;
    }
  }
}
