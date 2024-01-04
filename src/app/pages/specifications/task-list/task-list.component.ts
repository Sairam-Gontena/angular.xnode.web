import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilsService } from '../../../components/services/utils.service';
import { CommentsService } from '../../../api/comments.service';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { Comment } from 'src/models/comment';
import { SECTION_VIEW_CONFIG } from '../section-view-config';
import { MessagingService } from '../../../components/services/messaging.service';
import { MessageTypes } from 'src/models/message-types.enum';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
declare const SwaggerUIBundle: any;
import { Subscription, delay, of } from 'rxjs';
@Component({
  selector: 'xnode-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  @Input() list: any;
  @Input() usersList: any;
  @Input() topParentId: any;
  @Input() activeIndex: any;
  @Input() swaggerData:any;
  @Input() searchIconKeyword:any;
  @Input() From: any;
  @Output() onClickClose = new EventEmitter<any>();
  paraViewSections = SECTION_VIEW_CONFIG.paraViewSections;
  listViewSections = SECTION_VIEW_CONFIG.listViewSections;
  userRolesViewSections = SECTION_VIEW_CONFIG.userRoleSection;
  userPersonaViewSections = SECTION_VIEW_CONFIG.userPersonaSection;
  comment: any;
  currentUser: any;
  selectedSection: any;
  showNewCrPopup: boolean = false;
  selectedComment: any;
  showCommentInput: boolean = false;
  openEditComment: boolean = false;
  selectedIndex?: number;
  showDeletePopup: boolean = false;
  action?: string;
  showCrPopup: boolean = false;
  usersData: any;
  users: any = [];
  originalBackgroundColor: string = 'blue';
  showReplies: boolean = false;
  replies: any;
  specListCopy: any;
  specList: any[] = [];
  showConfirmationPopup: boolean = false;
  confirmarionContent: string = '';
  confirmarionHeader: string = '';
  fileIndex: any;
  targetUrl: string = '';
  iframeSrc: SafeResourceUrl = '';
  parentId: any;
  private searchKeywordSubscription: Subscription = new Subscription;
  private searchByUserSubscription: Subscription = new Subscription;

  constructor(private utils: UtilsService,
    private commentsService: CommentsService,
    private sanitizer: DomSanitizer,
    private specUtils: SpecUtilsService,
    private messagingService: MessagingService) {
    this.utils.getMeLatestConversation.subscribe((event: any) => {
      if (event === 'REPLY') {
        this.showCommentInput = false;
        this.action = ''
      }
    })
  }

  ngOnInit() {
    this.list.forEach((element: any) => {
      element.repliesOpened = false;
    });
    this.specListCopy = this.list;
    this.makeTrustedUrl();
    this.checkSwaggerItem();
    this.searchKeywordSubscription=this.specUtils.getTaskPanelSearchByKeywordTaskList().subscribe((data:any)=>{
      this.filterListBySearch(data);
    });
    this.searchByUserSubscription = this.specUtils.getTaskPanelSearchByUsersListData().subscribe((data:any) => {
      this.filterListByUsersFilter(data);
    });
  }

  filterListBySearch(users?:any){
    if(this.searchIconKeyword.length>0){
      this.searchIconKeyword = this.searchIconKeyword.toLowerCase()
      this.list = this.list.filter((item: any) => item.title.toLowerCase().includes(this.searchIconKeyword));
    }else{
      this.list = this.specListCopy;
    }
    if(users){
      this.filterListByUsersFilter(users);
      return
    }
  }

  filterListByUsersFilter(users:any){
    if(users.length>0){
      this.list = this.specListCopy;
      this.list = this.list.filter((item: any) => users.includes(item.assignee.userId));
    }else{
      this.list = this.specListCopy;
    }
    if(this.searchIconKeyword.length>0){
      this.filterListBySearch();
      return
    }
  }

  checkSwaggerItem() {
    this.list.forEach((item: any) => {
      if (item.referenceContent.title == 'OpenAPI Spec') {
        of(([])).pipe(
          delay(500)
        ).subscribe((results) => {
          this.fetchOpenSpecApi(item.id)
        });
      }
    })
  }

  fetchOpenSpecApi(id: any) {
    const ui = SwaggerUIBundle({
      domNode: document.getElementById('openapi-ui-spec' + id),
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset,
      ],
      spec: this.swaggerData,
      docExpansion: 'none',
      operationsSorter: 'alpha',
    });
  }

  makeTrustedUrl(): void {
    let target = localStorage.getItem('targetUrl');
    if (target) {
      this.targetUrl = target;
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.targetUrl
      );
    }
  }

  checkParaViewSections(title: string, parentTitle?: string) {
    if (parentTitle == 'Technical Specifications') {
      return;
    }
    return (
      this.paraViewSections.filter((secTitle) => {
        return secTitle === title;
      }).length > 0
    );
  }

  checkListViewSections(title: string) {
    return (
      this.listViewSections.filter((secTitle) => {
        return secTitle === title;
      }).length > 0
    );
  }

  checkUserRoleSections(title: string) {
    return (
      this.userRolesViewSections.filter((secTitle) => {
        return secTitle === title;
      }).length > 0
    );
  }

  checkUserPersonaSections(title: string) {
    return (
      this.userPersonaViewSections.filter((secTitle) => {
        return secTitle === title;
      }).length > 0
    );
  }

  receiveMsg(event: any) {
    if (event) {
      this.list.forEach((item: any) => {
        if (item.comments) {
          item.comments.forEach((comment: any) => {
            if (comment.id == event) {
              item.repliesOpened = false;
            }
          });
        }
      });
    }
  }

  loadComments(change: string) {
    if (change === 'increment') {
      const startIndex = this.specList.length;
      const endIndex = Math.min(startIndex + 2, this.specListCopy.length);
      const newItems = this.specListCopy.slice(startIndex, endIndex);
      this.specList.push(...newItems);
    } else {
      this.specList = this.specListCopy.slice(0, 2);
    }
  }

  setAvatar(userObj: any): string {
    let avatar: string = '';
    if (userObj.createdBy && userObj.createdBy?.displayName) {
      avatar = userObj.createdBy.firstName.charAt(0).toUpperCase() + userObj.createdBy.lastName.charAt(0).toUpperCase();
    } else if (userObj.assignee && userObj.assignee?.displayName) {
      avatar = userObj.assignee.firstName.charAt(0).toUpperCase() + userObj.assignee.lastName.charAt(0).toUpperCase();
    } else {
      avatar = '';
    }
    return avatar;
  }

  eventFromConversationAction(data: { action: string, cmt: any }) {
    this.action = data.action;
    if (data.action === 'REPLY') {
      this.onClickReply(data.cmt);
    } if (data.action === 'EDIT') {
      this.editComment(data.cmt);
    } if (data.action === 'LINK_TO_CR') {
      this.linkToCr(data.cmt);
    } if (data.action === 'DELETE') {
      this.onClickDeleteTask(data.cmt);
    }
  }

  onClickReply(cmt: any): void {
    this.parentId = cmt.id;
    this.topParentId = null;
    this.selectedComment = cmt;
    this.showCommentInput = true;
    this.action = 'REPLY';
  }

  editComment(cmt: number): void {
    this.selectedComment = cmt;
    this.showCommentInput = true;
    this.action = 'EDIT';
  }

  onClickDeleteTask(comment: string): void {
    this.selectedComment = comment;
    this.showConfirmationPopup = true;
    this.confirmarionContent = "Are you sure, Do you want to delete this Task?";
    this.confirmarionHeader = "Delete Task";
  }

  toggleConfirmPopup(event: boolean) {
    this.showDeletePopup = event
  }

  deleteTask() {
    this.utils.loadSpinner(true);
    this.commentsService.deletTask(this.selectedComment.id).then(res => {
      if (res && res.status === 200) {
        this.utils.loadToaster({ severity: 'success', summary: 'Success', detail: 'Task deleted successfully' });
        this.specUtils._tabToActive('TASK');
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: res.data?.detail });
      }
      this.utils.loadSpinner(false);
    }).catch(err => {
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });
      this.utils.loadSpinner(false);
    })
  }

  highlightMatch(conversation: string): SafeHtml {
    const regex = /@.*?,/g;
    const highlighted = conversation?.replace(regex, (match) => {
      const matchedTextWithoutComma = match.slice(0, -1);
      const spanWithId = `<span class="highlight-tags" style="color:rgb(2, 173, 238);" >${matchedTextWithoutComma}</span>`;
      return spanWithId;
    });
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  checktableJsonSection(title: string): boolean {
    return title === 'Business Rules' || title === 'Functional Dependencies' || title === 'Data Dictionary' || title === 'User Interfaces' || title === 'Annexures'
  }

  modifiedTimeDifference(modifiedOn: Date): string {
    const now = new Date();
    const modifiedTime = new Date(modifiedOn);
    const timeDifference = now.getTime() - modifiedTime.getTime();
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    if (minutesDifference < 1) {
      return 'Just now';
    } else if (minutesDifference === 1) {
      return '1m ago';
    } else if (minutesDifference < 60) {
      return `${minutesDifference}m ago`;
    } else {
      const hoursDifference = Math.floor(minutesDifference / 60);
      if (hoursDifference === 1) {
        return '1h ago';
      } else {
        return `${hoursDifference}h ago`;
      }
    }
  }

  viewReplies(cmt?: any) {
    if (!cmt.topParentId || cmt.topParentId !== null) {
      this.topParentId = cmt.id;
    }
    this.showReplies = true;
    if (cmt)
      this.selectedComment = cmt;

    this.utils.loadSpinner(true);
    this.commentsService.getComments({ parentId: this.selectedComment.id }).then((response: any) => {
      if (response && response.data) {
        this.replies = response.data;
        response.data.forEach((element: any) => {
          element.parentUser = this.list.filter((ele: any) => { return ele.id === this.selectedComment.id })[0].createdBy;
        });
        this.list.forEach((obj: any) => {
          if (obj.id === cmt.id) {
            obj.comments = response.data;
            obj.repliesOpened = true
          }
        })
        this.replies = response.data;

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

  hideReplies(cmt?: any) {
    this.list.forEach((obj: any) => {
      if (obj.id === this.selectedComment.id) {
        obj.comments = this.replies;
        obj.repliesOpened = false
      }
    })
  }


  linkToCr(cmt?: any) {
    if (cmt) {
      this.selectedComment = cmt;
      this.showCrPopup = true;
      this.messagingService.sendMessage({
        msgType: MessageTypes.LinkToCR,
        msgData: cmt
      });
    }

  }
  deleteAttachment(cmt: any, index: number): void {
    this.fileIndex = index;
    this.showConfirmationPopup = true;
    this.selectedComment = cmt;
    this.confirmarionContent = "Are you sure, Do you want to delete this Attachment?";
    this.confirmarionHeader = "Delete Attachment";
    this.action = 'DELETE_ATTACHMENT';
  }

  onClickConfirmationAction(event: any): void {
    if (event === 'Yes') {
      this.checkAction();
    }
    this.showConfirmationPopup = false;
  }

  checkAction(): void {
    if (this.action === 'DELETE') {
      this.deleteTask()
    } else if (this.action === 'DELETE_ATTACHMENT') {
      this.deleteFile(this.selectedComment);
    }
  }
  deleteFile(cmt: any) {
    let latestFiles: any[] = [];
    cmt?.attachments?.map((res: any, index: number) => {
      if (index !== this.fileIndex) {
        latestFiles.push(res.fileId)
      }
    })
    cmt.attachments = latestFiles;
    cmt.assignee = cmt.assignee.userId;
    this.saveAsTask(cmt);
  }

  saveAsTask(cmt: any): void {
    this.commentsService.addTask(cmt).then((commentsReponse: any) => {
      if (commentsReponse.statusText === 'Created') {
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'File deleted successfully' });
        this.fileIndex = null;
        this.specUtils._tabToActive('TASK');
      } else {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: commentsReponse?.data?.common?.status });
      }
      this.utils.loadSpinner(false);
    }).catch(err => {
      this.utils.loadSpinner(false);
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }
}
