import { Component, Input, SimpleChange,ViewChild } from '@angular/core';
import { UtilsService } from '../../../components/services/utils.service';
import { CommentsService } from 'src/app/api/comments.service';
import { DropdownOptions } from 'src/models/dropdownOptions';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { ApiService } from 'src/app/api/api.service';
import { SpecConversationComponent } from '../spec-conversation/spec-conversation.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TaskListComponent } from '../task-list/task-list.component';
import { MentionConfig } from 'angular-mentions';
@Component({
  selector: 'xnode-tasks-panel',
  templateUrl: './tasks-panel.component.html',
  styleUrls: ['./tasks-panel.component.scss']
})
export class TasksPanelComponent {
  @Input() specData?: any;
  @Input() commenttasksList: any;
  @Input() usersList: any;
  @Input() activeIndex: any;
  @Input() swaggerData:any;
  searchIconKeyword:string='';
  selectedUsers:any=[];
  @ViewChild(TaskListComponent)
  child!: TaskListComponent;
  userImage?: any = "DC";
  username?: any;
  filterOptions: Array<DropdownOptions> = [{ label: 'All', value: 'ALL' },{ label: 'Linked', value: 'LINKED' },{ label: 'New', value: 'NEW' },{ label: 'Closed', value: 'CLOSED' }];
  selectedFilter: { label: string; value: string } = { label: 'All', value: 'ALL' };
  commentObj: any = {
    comment: '',
    role: '',
    user_id: ''
  };
  config: MentionConfig = {};
  selectedUserNames: any =[];
  searchUsersTextArea:any;
  references:any;
  hideSearch:boolean=false;
  usersInTextArea:any=[];
  product: any;
  comment: any;
  currentUser: any;
  selectedSection: any;
  selectedComment: any;
  showCommentInput: boolean = false;
  openEditComment: boolean = false;
  selectedIndex?: number;
  enableDeletePrompt: boolean = false;
  action?: string;
  list: any = [];
  filteredList:any=[]
  usersData: any;
  users: any = [];
  originalBackgroundColor: string = 'blue';
  searchUpdated: Subject<string> = new Subject<string>();
  filter={
    text:false,
    users:false
  }
  constructor(private utils: UtilsService,
    private commentsService: CommentsService,
    private specUtils: SpecUtilsService,
    private localStorageService: LocalStorageService,
    private sanitizer: DomSanitizer,
    private apiService:ApiService) {
    this.specData = this.localStorageService.getItem(StorageKeys.SelectedSpec);
    this.product = this.localStorageService.getItem(StorageKeys.Product);
    this.specUtils.tabToActive.subscribe((res: any) => {
      if (res == 'TASK') {
        this.getMeTasksList();
      }
    });
  }

  ngOnInit(): void {
    if(this.specUtils.specConversationPanelFrom == 'spec_header'){
      let spec_version = localStorage.getItem('SPEC_VERISON');
      if(spec_version){
      let data = JSON.parse(spec_version);
      let id;
      data.id ? id=data.id : id=data.versionId ;
      this.utils.loadSpinner(true);
      this.apiService.getComments('task/tasks-by-productId?productId='+data.productId+'&verisonId='+id).then((res:any)=>{
          if (res.status === 200 && res.data) {
            this.list = res.data;
            this.filterList(res.data);
          }
          this.utils.loadSpinner(false);
        }).catch((err)=>{
          console.log(err);
          this.utils.loadSpinner(false);
        })
      }
    }
    this.specUtils.getMeProductDropdownChange.subscribe((res)=>{
      if(res){
        if(this.activeIndex == 1){
          this.specData = this.localStorageService.getItem(StorageKeys.SelectedSpec);
          this.getMeTasksList();
        }
      }
    })
    this.searchUpdated.pipe(debounceTime(1000)).subscribe(search => {
      this.child.filterListBySearch();
    });
    this.references = [];
    this.config = {
      labelKey: 'name',
      mentionSelect: this.format.bind(this),
    };
  }

  format(item: any) {
    const entityId = item.user_id;
    const isDuplicate = this.references.some((reference: any) => reference.entity_id === entityId);
    if (!isDuplicate) {
      this.references.push({ entity_type: "User", entity_id: entityId, product_id: this.product?.id || null });
    }
    let firstLetter = item.first_name.substring(0, 1);
    let lastLetter = item.last_name.substring(0, 1);
    if(this.selectedUserNames.length>0){
      this.selectedUserNames.forEach((elem:any)=>{
        if(elem.name != item.name ){ this.usersInTextArea+=`${item.first_name} ${item.last_name},` }
      });
    }else{
      this.usersInTextArea+=`${item.first_name} ${item.last_name},`;
    }
    this.selectedUserNames.push({avatar:firstLetter+lastLetter, name: item.name,id:item.user_id});
    this.userFilter(item.user_id)
    return '';

  }

  deleteUserId(id:any){
    this.selectedUsers?.forEach((element:any,index:any) => {
      if(element.includes(id)) {  this.selectedUsers.splice(index, 1); }
    });
    this.selectedUserNames?.forEach((user:any,index:any)=>{
      if(user.id == id){  this.selectedUserNames.splice(index, 1); }
    });
    if(this.selectedUserNames.length==0){
      this.child.list = this.child.specListCopy;
    }
  }

  filterDisplay(entity:any){
    if(entity=='text'){
      this.filter.text=true;
      this.filter.users=false;
    }
    if(entity=='users'){
      this.filter.text=false;
       this.filter.users=true;
    }
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.stopPropagation();
    }
  }

  userFilter(elementId:any){
    this.selectedUsers.push(elementId)
    this.child.filterListByUsersFilter(this.selectedUsers);
  }

  searchConversation(event:any){
    this.searchUpdated.next(this.searchIconKeyword);
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if(this.specUtils.specConversationPanelFrom == ''){
      const activeIndexChange = changes['activeIndex'] as SimpleChange;
      if (activeIndexChange && activeIndexChange.currentValue === 1) {
        this.specData = this.localStorageService.getItem(StorageKeys.SelectedSpec);
        this.getMeTasksList();
      }
    }
  }

  getMeTasksList() {
    this.utils.loadSpinner(true);
    this.commentsService.getTasks({ parentId: this.specData?.id }).then((response: any) => {
      if (response && response.data?.common?.status !== 'fail') {
        this.list = response.data;
        this.filterList(response.data);
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data?.common?.status });
      }
      this.utils.loadSpinner(false);
    }).catch(err => {
      console.log(err);
      this.utils.loadSpinner(false);
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    });
  }

  filterList(data: any): void {
    switch (this.selectedFilter.value) {
      case 'LINKED':
        this.filteredList = data.filter((item: any) => item.status === 'LINKED');
        break;
      case 'NEW':
        this.filteredList = data.filter((item: any) => item.status === 'NEW');
        break;
      case 'CLOSED':
        this.filteredList = data.filter((item: any) => item.status === 'CLOSED');
        break;
      default:
        this.filteredList = data;
        break;
    }
  }

  onClickReply(cmt: any): void {
    this.selectedComment = cmt;
    this.showCommentInput = true;
    this.action = 'REPLY';
  }

  editComment(cmt: number): void {
    this.selectedComment = cmt;
    this.showCommentInput = true;
    this.action = 'EDIT';
  }

  deleteCurrentComment(comment: string): void {
    this.selectedComment = comment;
    this.enableDeletePrompt = true
  }

  handleConfirmationPrompt(event: boolean): void {
    this.utils.loadSpinner(true);
    this.enableDeletePrompt = event;
    this.commentsService.deletComment(this.selectedComment.id).then(res => {
      if (res) {
        this.utils.loadToaster({ severity: 'success', summary: 'Success', detail: 'Comment deleted successfully' });
        this.utils.updateConversationList('reply');
      }
      this.utils.loadSpinner(false);
    }).catch(err => {
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });
      this.utils.loadSpinner(false);
    })
  }

  highlightMatch(conversation: string): SafeHtml {
    const regex = /@.*?,/g;
    const highlighted = conversation.replace(regex, (match) => {
      const matchedTextWithoutComma = match.slice(0, -1);
      const spanWithId = `<span class="highlight-tags" style="color:rgb(2, 173, 238);" >${matchedTextWithoutComma}</span>`;
      return spanWithId;
    });
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  viewReplys(cmt: any) {
    this.utils.loadSpinner(true);
    this.commentsService.getComments({ topParentId: cmt.id }).then((response: any) => {
      if (response && response.data) {
        response.data.forEach((element: any) => {
          element.parentUser = this.commenttasksList.filter((ele: any) => { return ele.id === cmt.id })[0].createdBy;
        });
        this.commenttasksList.forEach((obj: any) => {
          if (obj.id === cmt.id) {
            obj.comments = response.data;
          }
        })
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: response.data?.status });
      }
      this.utils.loadSpinner(false);
    }).catch(err => {
      console.log(err);
      this.utils.loadSpinner(false);
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });

    });
  }

}
