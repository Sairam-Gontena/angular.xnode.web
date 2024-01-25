import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { DropdownOptions } from 'src/models/dropdownOptions';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { CommentsService } from 'src/app/api/comments.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'xnode-comments-panel',
  templateUrl: './comments-panel.component.html',
  styleUrls: ['./comments-panel.component.scss'],
})
export class CommentsPanelComponent implements OnInit {
  @Input() usersList: any;
  @Input() list: any;
  @Input() activeIndex: any;
  @Input() swaggerData: any;
  showInput = false;
  specData: any;
  filter: any;
  searchIconKeyword: string = '';
  selectedUsers: any = [];
  status:any;
  filterOptions: Array<DropdownOptions> = [
    { label: 'All', value: 'ALL' },
    { label: 'Linked', value: 'LINKED' },
    { label: 'New', value: 'NEW' },
    { label: 'Closed', value: 'CLOSED' },
  ];
  selectedFilter: { label: string; value: string } = { label: 'All', value: 'ALL', };
  selectedComment: any;
  filteredList: any = [];
  product: any;
  searchUpdated: Subject<string> = new Subject<string>();
  selectedUserNames: any = [];

  constructor(
    private specUtils: SpecUtilsService,
    private storageService: LocalStorageService,
    private apiComment:CommentsService,
    private utils:UtilsService
  ) {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.searchUpdated.pipe(debounceTime(1000)).subscribe((search) => {
      this.specUtils.sendCommentSearchByKeywordListData(this.selectedUsers);
    });
    if(!this.usersList || this.usersList==undefined){
      this.usersList== this.storageService.getItem(StorageKeys.USERLIST);
      // this.usersList=userlist.forEach((item:any)=>{
      //   item.name = item.first_name+' '+item.last_name;
      // })
    }
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
    this.filterList();
    // this.specData = this.storageService.getItem(StorageKeys.SpecVersion);
    // console.log('commentspanelts',this.specData)
    // this.utils.loadSpinner(true);
    // this.getCommentsByStatus();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['list']?.currentValue) {
      this.filteredList = [];
      this.list = changes['list'].currentValue;
      this.filterList();
    }
  }
  getCommentsByStatus(status?:any){
    let query = 'comment/comments-by-productId?productId='+this.specData.productId+'&verisonId='+this.specData.id;
    if(status){
      query = 'comment/comments-by-productId?productId='+this.specData.productId+'&verisonId='+this.specData.id+'&status='+status;
    }
    this.apiComment.getComments(query).then((res:any)=>{
      if (res.status === 200 && res.data) {
        this.list = res.data;
        this.filteredList =  this.list;
        // this.filterList(res.data);
      }
      this.utils.loadSpinner(false);
    }).catch((err:any)=>{
      this.utils.loadSpinner(false);
    })
  }

  filterList(data?: any): void {
    this.filteredList = [];
    switch (this.selectedFilter.value) {
      case 'LINKED':
        this.filteredList = this.list.filter(
          (item: any) => item.status === 'LINKED'
        );
        break;
      case 'UNLINKED':
        this.filteredList = data.filter(
          (item: any) => item.status === 'UNLINKED'
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
